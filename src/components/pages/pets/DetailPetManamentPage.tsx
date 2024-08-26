/* eslint-disable @next/next/no-img-element */
'use client';
import React, { ChangeEvent, FocusEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BoxTitle, DivTextfield, DropdownTippy, LoadingPrimary, MiniLoading, TextArea, WrapperAnimation } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDropzone } from 'react-dropzone';
import { ApiActionPetAdmin, ImageType } from '@/configs/types';
import { fileToUrl } from '@/utils/format';
import { IPetManagementFormResuqest } from '@/configs/interface';
import Validate from '@/utils/validate';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { Switch, Tooltip } from '@mui/material';
import { useGetPetAttributes } from '@/hooks';
import { dataTakeAction } from '@/datas/adopt';
import { getPetManagement, petDetail } from '@/apis/pets';
import { notFound, useRouter } from 'next/navigation';
import { delay } from '@/utils/funtionals';
import { generateContentWithAi } from '@/apis/outside';
import { toast } from 'react-toastify';
import { contants } from '@/utils/contants';
import { links } from '@/datas/links';
import WraperDialog from '@/components/dialogs/WraperDialog';
import { deleteImageOfPet } from '@/apis/admin/pets';

interface ValidateType {
    colors: string;
    images: string;
    description: string;
    fosterDate: string;
    name: string;
    sex: string;
    breed: string;
    size: string;
    status: string;
}

const initData = {
    images: [],
    colors: new Set<string>(),
    breed: '',
    description: '',
    fosterDate: '',
    name: '',
    sex: '',
    size: '',
    spay: true,
    status: '',
} as IPetManagementFormResuqest;

const initValidData = {
    description: '',
    fosterDate: '',
    images: '',
    name: '',
    colors: '',
    breed: '',
    sex: '',
    size: '',
    status: '',
} as ValidateType;

export interface IDetailPetManagementPageProps {
    id?: string;
    actionFN: ApiActionPetAdmin;
    onSubmit?: () => void;
}

const ImageItem = ({
    showClose = true,
    item,
    index,
    handleCloseImage,
}: {
    showClose?: boolean;
    handleCloseImage: (item: ImageType, index: number) => void;
    item: ImageType;
    index: number;
}) => {
    return (
        <div className="relative aspect-square w-full max-h-[124px] rounded-lg overflow-hidden border border-gray-primary" key={item.link}>
            <img className="w-full h-full object-cover" src={item.link} alt={item.link} />
            {showClose && (
                <WrapperAnimation onClick={() => handleCloseImage(item, index)} hover={{}} className="absolute top-2 right-2 text-white cursor-pointer">
                    <FontAwesomeIcon icon={faXmarkCircle} />
                </WrapperAnimation>
            )}
        </div>
    );
};

export default function DetailPetManagementPage({ id, onSubmit, actionFN }: IDetailPetManagementPageProps) {
    // quuey

    const rawData = useQuery({
        queryKey: ['getPetManagement', id],
        queryFn: () => {
            if (id) {
                return getPetManagement(id);
            }

            return null;
        },
    });

    // router

    const router = useRouter();

    // constant variables
    const listLinkImageWillDelete = new Set<string>();
    const limit = 4;
    // states
    const [images, setImages] = useState<ImageType[]>([]);
    const [form, setForm] = useState<IPetManagementFormResuqest>(initData);
    const [error, setError] = useState<ValidateType>({ ...initValidData });
    const [openModal, setOpenModal] = useState(false);
    const [imageDelete, setImageDelete] = useState<null | ImageType>(null);

    const [loading, setLoading] = useState(false);
    const [loadingDescription, setloadingDescription] = useState(false);

    // dropzone

    // cutom hooks
    const acttributes = useGetPetAttributes();

    const onDrop = useCallback(
        (acceptedFiles: any) => {
            const files = acceptedFiles as File[];

            if (!files) return;

            let listImages = files.map((image) => {
                const link = fileToUrl(image);
                listLinkImageWillDelete.add(link);
                return {
                    data: image,
                    link,
                } as ImageType;
            });

            console.log(listImages);

            if (images.length > 0 && images.filter((image) => image.data == null).length >= limit) {
                toast.warn('Please delete photos to add');
                return;
            }

            if (listImages.length > limit && images.length <= 0) {
                listImages = listImages.slice(0, limit);
                setImages((prev) => [...prev, ...listImages]);
                return;
            }

            if (images.length >= 0 && images.length < limit) {
                listImages = listImages.slice(0, limit - images.length);
                setImages((prev) => [...prev, ...listImages]);
                return;
            }

            if (images.length >= limit && listImages.length >= limit) {
                setImages(listImages);
                return;
            }

            if (images.length >= limit && listImages.length > 0) {
                listImages = listImages.slice(0, limit);
                setImages(listImages);
                return;
            }

            setImages((prev) => [...prev, ...listImages]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [images],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleCloseImage = useCallback(
        (image: ImageType, index: number) => {
            if (!image.data && id) {
                setOpenModal(true);
                setImageDelete(image);
                return;
            }

            images.splice(index, 1);
            setImages([...images]);
        },
        [images, id],
    );

    const handleCloseColor = useCallback(
        (color: string) => {
            if (!form.colors.size) return;

            form.colors.delete(color);

            setForm((prev) => ({ ...prev, colors: prev.colors }));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form.colors],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.name === 'spay') {
            setForm({
                ...form,
                spay: (event as ChangeEvent<HTMLInputElement>).target.checked,
            });
            return;
        }
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const dynamicKey = e.target.name as keyof ValidateType;
        if (dynamicKey === 'colors') {
            if (form.colors.size <= 0) {
                setError({
                    ...error,
                    colors: 'Please choose a color',
                });
            } else {
                setError({
                    ...error,
                    colors: '',
                });
            }
        } else if (dynamicKey === 'images') {
            // not blur
        } else {
            const { message } = Validate[dynamicKey](form[dynamicKey]);
            setError({
                ...error,
                [dynamicKey]: message,
            });
        }
    };

    const validate = () => {
        let flag = false;
        const validateErrors: ValidateType = { ...initValidData };

        const keys: string[] = Object.keys(validateErrors);

        keys.forEach((key) => {
            const dynamic = key as keyof ValidateType;

            if (dynamic === 'colors') {
                if (form.colors.size <= 0) {
                    validateErrors.colors = 'Please choose a color';
                } else {
                    validateErrors.colors = '';
                }
            } else if (dynamic === 'images') {
                if (images.length <= 0 || images.length > limit) {
                    validateErrors.images = `Please select ${limit} photos of pet`;
                } else if (images.length === limit) {
                    validateErrors.images = '';
                }
            } else {
                const { message, error } = Validate[dynamic](form[dynamic].toString());
                validateErrors[dynamic] = message;
            }
        });

        flag = Object.values(validateErrors).some((item) => {
            return item.length > 1;
        });

        setError(validateErrors);

        return flag;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) return;

        let response = null;

        try {
            // set loading in this page
            setLoading(false);

            if (id) {
                // this update
                response = await actionFN(form, { id: data?.id, images });
            } else {
                // this create
                response = await actionFN(form, { images });
            }

            if (!response && images.some((item) => item.data)) return toast.warn('Photo is too large');

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(response.message);
            if (id) {
                rawData.refetch();
            } else {
                router.push(links.adminFuntionsLink.pets.index);
            }
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
        }

        console.log(form);
    };

    const handleGenerateContent = async () => {
        try {
            setloadingDescription(true);

            const response = await generateContentWithAi({ ...form });

            const content = response?.choices[0]?.message?.content;

            if (content) {
                setForm({
                    ...form,
                    description: content,
                });
            }
        } catch (error) {
            console.log('handleGenerateContent: ' + error);
            toast.error(contants.messages.errors.server);
        } finally {
            setloadingDescription(false);
        }
    };

    const handleDeleteImage = async () => {
        try {
            if (!imageDelete || !data?.id) return;
            setLoading(true);

            const response = await deleteImageOfPet(data?.id, [imageDelete]);

            if (!response) return toast.warn(contants.messages.errors.handle);

            if (response.errors) return toast.warn(response.message);

            toast.success(response.message);
            setOpenModal(false);
            setImageDelete(null);
            rawData.refetch();
        } catch (error) {
            toast.error(contants.messages.errors.server);
        } finally {
            setLoading(false);
        }
    };

    const data = useMemo(() => {
        return rawData.data && rawData.data.data;
    }, [rawData.data]);

    const isShowCloseImage = useCallback(
        (image: ImageType) => {
            const validImage = images.filter((item) => !item.data);

            if (validImage.length <= 1 && !image.data) {
                return false;
            }
            return true;
        },
        [images],
    );

    useEffect(() => {
        if (!data) return;

        (async () => {
            setLoading(true);
            await delay(500);

            requestIdleCallback(() => {
                setForm({
                    name: data.name,
                    breed: data.breed,
                    colors: new Set<string>([...data.color.split(', ')]),
                    description: data.description,
                    fosterDate: data.fostered as string,
                    images: [],
                    sex: data.sex,
                    size: data.size,
                    spay: data.spay,
                    status: data.status,
                });

                const rawImages = data.images.map((image) => {
                    return {
                        data: null,
                        link: image,
                    } as ImageType;
                });

                setImages(rawImages);
            });

            if (!rawData.isLoading) {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        return () => {
            if (listLinkImageWillDelete.size <= 0) return;

            Array.from(listLinkImageWillDelete).forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (rawData.isError || rawData.data?.errors) {
        notFound();
    }

    return (
        <BoxTitle mbUnderline="mb-0" mt="mt-0" border={false} title={id ? 'UPDATE PET' : 'CREATE PET'}>
            <form onSubmit={handleSubmit} className="w-full flex justify-between gap-10">
                <div className="w-1/5">
                    {!Validate.isBlank(error.images) && (
                        <div className="mb-2 italic text-sm text-red-primary">
                            <small>{error.images}</small>
                        </div>
                    )}
                    <div
                        {...getRootProps()}
                        className="relative overflow-hidden w-full aspect-square border-2 border-blue-primary border-dashed flex flex-col gap-2 items-center justify-center rounded text-black-main"
                    >
                        <span>Select 4 photos</span>
                        <FontAwesomeIcon className="text-[80px] text-violet-secondary-2" icon={faImage} />
                        <input {...getInputProps()} />

                        {isDragActive && (
                            <div className="w-full h-full absolute inset-0 bg-black-040 flex items-center justify-center text-2xl text-white">
                                <FontAwesomeIcon className="" icon={faPlus} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 mt-5 gap-2">
                        {images.map((item, index) => {
                            return <ImageItem key={index} showClose={isShowCloseImage(item)} handleCloseImage={handleCloseImage} item={item} index={index} />;
                        })}
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col gap-5">
                    <DivTextfield
                        propsInput={{
                            placeholder: 'Name of pet',
                            name: 'name',
                            value: form.name,
                            onBlur: handleBlur,
                            onChange: handleChange,
                            message: error.name,
                            autoComplete: 'off',
                        }}
                        label="Name"
                    />

                    <div className="flex justify-between items-center gap-5">
                        <div className="flex-1 flex items-center gap-5">
                            <DivTextfield
                                dataSelectFilter={acttributes.data?.breeds || []}
                                propsInput={{
                                    name: 'breed',
                                    defaultValue: acttributes.data?.breeds[0].id || '',
                                    value: form.breed,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    message: error.breed,
                                }}
                                label="Breed"
                            />
                            <DivTextfield
                                dataSelect={dataTakeAction.fillters.genthers}
                                propsInput={{
                                    name: 'sex',
                                    defaultValue: dataTakeAction.fillters.genthers[0].id,
                                    value: form.sex,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    message: error.sex,
                                }}
                                label="Sex"
                            />
                        </div>

                        <div className="w-1/6 flex items-center justify-center">
                            <DivTextfield label="Spay">
                                <Switch name="spay" onChange={handleChange} checked={form.spay} color="primary" />
                            </DivTextfield>
                        </div>
                    </div>

                    <div className="flex gap-5 flex-col">
                        <DivTextfield label="Colors">
                            <DropdownTippy
                                onClickItem={(value) => {
                                    setForm((prev) => ({ ...prev, colors: prev.colors.add(value.name) }));
                                }}
                                onSubmit={(value) => {
                                    setForm((prev) => ({ ...prev, colors: prev.colors.add(value) }));
                                }}
                                placeholder="Colors of pet"
                                options={{ showValueBeforeClick: false }}
                                name="colors"
                                data={acttributes.data?.colors || []}
                                inputProps={{
                                    message: error.colors,
                                    onBlur: handleBlur,
                                }}
                            />
                        </DivTextfield>

                        {form.colors.size > 0 && (
                            <div className="flex flex-col gap-1 -mt-2">
                                <small className="italic text-xs">Click to close color</small>
                                <div className="flex items-center gap-5">
                                    {Array.from(form.colors).map((color) => {
                                        return (
                                            <div
                                                key={color}
                                                onClick={() => handleCloseColor(color)}
                                                className="w-fit cursor-pointer flex items-center justify-center px-5 py-1 rounded-md border border-violet-primary text-sm select-none"
                                            >
                                                <span className="capitalize">{color}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <DivTextfield
                            dataSelect={dataTakeAction.fillters.ages}
                            propsInput={{
                                name: 'size',
                                defaultValue: dataTakeAction.fillters.ages[0].id,
                                value: form.size,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                message: error.size,
                            }}
                            label="Size"
                        />

                        <DivTextfield
                            dataSelectFilter={dataTakeAction.fillters.status}
                            propsInput={{
                                name: 'status',
                                defaultValue: dataTakeAction.fillters.status[0].id,
                                value: form.status,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                message: error.status,
                            }}
                            label="Status"
                        />

                        <DivTextfield
                            propsInput={{
                                name: 'fosterDate',
                                type: 'date',
                                value: form.fosterDate,
                                onChange: handleChange,
                                onBlur: handleBlur,
                                message: error.fosterDate,
                            }}
                            label="Foster Date"
                        />
                        <DivTextfield
                            action={{
                                children: (
                                    <span className="text-sm">
                                        Generate content with chat GPT.{' '}
                                        <Tooltip
                                            placement="top"
                                            title={
                                                <div>
                                                    <span>Tips: </span>
                                                    <ol className="list-decimal pl-5">
                                                        <li>Enter complete information to get the best results</li>
                                                        <li>Press again for different results</li>
                                                    </ol>
                                                </div>
                                            }
                                        >
                                            <b onClick={handleGenerateContent} className="hover:underline text-blue-primary cursor-pointer">
                                                Try now
                                            </b>
                                        </Tooltip>
                                    </span>
                                ),
                                classnames: {
                                    wraper: 'flex items-center gap-4',
                                },
                            }}
                            label="Desciption"
                        >
                            <div className="w-full h-full relative overflow-hidden">
                                <TextArea
                                    className="w-full h-full"
                                    name="description"
                                    message={error.description}
                                    value={form.description}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {loadingDescription && (
                                    <div className="absolute inset-0 bg-black-040 mb-2 rounded-md ">
                                        <MiniLoading />
                                    </div>
                                )}
                            </div>
                        </DivTextfield>
                    </div>
                    <button type="submit" className="flex items-center justify-center outline-none border-none">
                        <WrapperAnimation hover={{}} className="w-1/4 bg-violet-primary rounded-lg flex justify-center items-center py-2 px-5 text-white cursor-pointer">
                            <span>{id ? 'UPDATE' : 'CREATE'}</span>
                        </WrapperAnimation>
                    </button>
                </div>
            </form>

            {loading || (rawData.isLoading && <LoadingPrimary />)}

            <WraperDialog open={openModal} setOpen={setOpenModal}>
                <div className="p-6 flex flex-col gap-4 items-center text-black-main">
                    Confirmed delete image
                    <div className="w-[80px] aspect-square rounded-md border border-gray-primary overflow-hidden">
                        <img className="w-full h-full object-cover" src={imageDelete?.link} alt={imageDelete?.link} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <WrapperAnimation
                            onClick={() => setOpenModal(false)}
                            hover={{}}
                            className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white"
                        >
                            Cancel
                        </WrapperAnimation>
                        <WrapperAnimation
                            onClick={handleDeleteImage}
                            hover={{}}
                            className="py-2 px-6 rounded-full hover:bg-[rgba(0,0,0,.2)] transition-all ease-linear cursor-pointer hover:text-white text-red-primary"
                        >
                            Comfirm
                        </WrapperAnimation>
                    </div>
                </div>
            </WraperDialog>
        </BoxTitle>
    );
}
