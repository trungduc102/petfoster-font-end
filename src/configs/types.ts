import { store } from '@/redux/store';

import {
    IOtherHistories,
    IApiBestSeller,
    IApiTakeAction,
    IBaseResponse,
    IDataFormPayment,
    IDetailProduct,
    IOrderItem,
    IProductRevenue,
    IProfile,
    IReports,
    ISalesOverviews,
    ISignDataResponse,
    IUser,
    TypesAndBrands,
    IDataFilterPage,
    IDataRequestFilter,
    PagiantionResponse,
    IProductManageList,
    DataProductType,
    ProductInfo,
    IImage,
    IUserManage,
    IInfoAddress,
    IFormChangePassword,
    IDetailOrder,
    IPayment,
    IOrder,
    IDataReview,
    IRequestReview,
    IOrderAdminItem,
    IOrderAdminFillterForm,
    ICart,
    IBrand,
    IRowReviewTable,
    IReviewAdminFillterForm,
    IDataDetailReview,
    IPriceHistories,
    ISearchItem,
    IProduct,
    IReview,
    IReviewHasReplay,
    IProfileMessageManage,
    IProvinceOutside,
    IDistrictOutside,
    IWardOutside,
    IHomepage,
    IPetDetailPageResponse,
    IRequestFilterPet,
    IPet,
    IPetAttribute,
    IPetDetail,
    IRequestFilterPetAdmin,
    IFeedBackRequest,
    IFeedback,
    IManageFeedbackResponse,
    IAddress,
    ApiDivision,
    IAdoption,
    IPetManagement,
    IRequestFilterAdoptionAdmin,
    IPetManagementFormResuqest,
    IRowTransaction,
    IFilterDonationRequest,
    PagiantionResponseWithTotal,
    IReportDonate,
    IPost,
    IParamsApiPostPage,
    IPostDetail,
    IComment,
    ICommentRequest,
    IPostRequest,
    IImagePost,
    IReportAdopt,
    IRowDetailUserAdoption,
} from './interface';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { RolesName } from './enum';
import { ITransactionResponse } from './interface-ousite';
export type ValidTags = keyof JSX.IntrinsicElements;

export type ApiGetUsers = () => Promise<IUser[]>;

export type ApiLogin = (data: UserFormType) => Promise<ISignDataResponse>;

export type ApiLoginWithFacebook = (data: UserLoginWithFacebookFormType) => Promise<ISignDataResponse>;

export type ApiLoginWithGoogle = (data: UserLoginWithGoogleFormType) => Promise<ISignDataResponse>;

export type TestOrders = () => Promise<ISignDataResponse>;

export type ApiRegister = (data: RegisterFormData) => Promise<ISignDataResponse>;

export type ApiTakeActionType = () => Promise<IBaseResponse<IApiTakeAction>>;

export type ApiDetailProductType = (idProduct: string) => Promise<IBaseResponse<IDetailProduct>>;

export type ApiGetTransaction = (page?: string) => Promise<IBaseResponse<PagiantionResponse<IRowTransaction>>>;

export type ApiReportDonation = (page?: string) => Promise<IBaseResponse<IReportDonate>>;

export type ApiFilterTransaction = (filter: IFilterDonationRequest) => Promise<IBaseResponse<PagiantionResponseWithTotal<IRowTransaction>>>;

export type ApiPetDetailPage = (id: string) => Promise<IBaseResponse<IPetDetailPageResponse>>;

export type ApiPostPage = (params: IParamsApiPostPage) => Promise<IBaseResponse<PagiantionResponse<IPost>>>;

export type ApiHightlightPostPage = (params: IParamsApiPostPage) => Promise<IBaseResponse<IPost[]>>;

export type ApiDetailPost = (id: string) => Promise<IBaseResponse<IPostDetail>>;

export type ApiCreatePost = (data: IPostRequest) => Promise<IBaseResponse<IPostDetail>>;

export type ApiUpdatePost = (data: IPostRequest, id: string) => Promise<IBaseResponse<IPostDetail>>;

export type ApiDeleteImage = (id: number) => Promise<IBaseResponse<IImagePost>>;

export type ApiCommentsWithPost = (id: string, page?: number) => Promise<IBaseResponse<PagiantionResponse<IComment>>>;

export type ApiPushCommentsWithPost = (data: ICommentRequest) => Promise<IBaseResponse<IComment>>;

export type ApiDeleteCommentsWithPost = (id: number) => Promise<IBaseResponse<IComment>>;

export type ApiLikeCommentsWithPost = (id: number) => Promise<IBaseResponse<IComment>>;

export type ApiLikePostsWithPost = (id: string) => Promise<IBaseResponse<IComment>>;

export type ApiPetManagement = (id: string) => Promise<IBaseResponse<IPetManagement>>;

export type ApiPetFavorite = (id: string) => Promise<IBaseResponse<any>>;

export type ApiPetAttributes = () => Promise<IBaseResponse<IPetAttribute>>;

export type ApiAdoptions = (status: string, page?: number) => Promise<IBaseResponse<PagiantionResponse<IAdoption>>>;

export type ApiAdoption = (data: { userId: string; petId: string; addressId: number }) => Promise<IBaseResponse<IAdoption>>;

export type ApiCancelAdoption = (data: { id: string; reason: string }) => Promise<IBaseResponse<IAdoption>>;

export type ApiFilterPets = (params: IRequestFilterPet) => Promise<IBaseResponse<PagiantionResponse<IPet>>>;

export type ApiFilterPetsAdmin = (params: IRequestFilterPetAdmin) => Promise<IBaseResponse<PagiantionResponse<IPetDetail>>>;

export type ApiActionPetAdmin = (data: IPetManagementFormResuqest, differentData: { id?: string; images?: ImageType[] }) => Promise<IBaseResponse<IPetDetail>>;

export type ApiActionImagePetAdmin = (id: string, images: ImageType[]) => Promise<IBaseResponse<any>>;

export type ApiFilterAdoptionAdmin = (params: Partial<IRequestFilterAdoptionAdmin>) => Promise<IBaseResponse<PagiantionResponse<IAdoption>>>;

export type ApiCancelAdoptionAdmin = (data: { id: string; reason: string }) => Promise<IBaseResponse<IAdoption>>;

export type ApiChangeStateAdoptionAdmin = (data: { id: string; state?: LabelAdopt; data: string }) => Promise<IBaseResponse<IAdoption>>;

export type ApiAcceptStateAdoptionAdmin = (data: { id: string; state?: LabelAdopt; data: string }) => Promise<IBaseResponse<IAdoption[]>>;

export type ApiReportType = () => Promise<IBaseResponse<IReports>>;

export type ApiSalesOverviewType = (year: string) => Promise<IBaseResponse<ISalesOverviews>>;

export type ApiRevenueDateType = (dates: { start?: string; end?: string }) => Promise<IBaseResponse<IProductRevenue>>;

export type ApiReportAdopt = () => Promise<IBaseResponse<IReportAdopt[]>>;

export type ApiPayment = (data: IPayment) => Promise<IBaseResponse<any>>;

export type ApiCreateOrder = (data: IOrder) => Promise<IBaseResponse<string>>;

export type ApiBestSellerType = (page: number | undefined) => Promise<IBaseResponse<IApiBestSeller>>;

export type ApiHistory = (page?: number | undefined, status?: StateType | string) => Promise<IBaseResponse<IOtherHistories>>;

export type ApiDetailHistory = (id: string | number) => Promise<IBaseResponse<IDetailOrder>>;

export type ApiGetSearchHistories = () => Promise<IBaseResponse<ISearchItem[]>>;

export type ApiActionSearchHistories = (data: ISearchItem) => Promise<IBaseResponse<ISearchItem[]>>;

export type ApiGetRecentViews = () => Promise<IBaseResponse<IProduct[]>>;

export type ApiActionRecentViews = (id: string) => Promise<IBaseResponse<IProduct[]>>;

export type ApiGetFavorite = (page?: string | null) => Promise<IBaseResponse<PagiantionResponse<IPet>>>;

export type ApiTypesAndBrands = () => Promise<IBaseResponse<TypesAndBrands>>;

export type ApiResetPassword = (email: string) => Promise<IBaseResponse<any>>;

export type ApiChangePassword = (data: IFormChangePassword) => Promise<IBaseResponse<any>>;

export type ApiGetCurUser = () => Promise<IBaseResponse<IProfile>>;

export type ApiGetCurUserWithUsername = (username: string) => Promise<IBaseResponse<IProfile>>;

export type ApiFilterPage = (data: IDataRequestFilter) => Promise<IBaseResponse<IDataFilterPage>>;

export type ApiHomePage = () => Promise<IBaseResponse<IHomepage>>;

export type ApiSendFeedBack = (data: IFeedBackRequest) => Promise<IBaseResponse<any>>;

export type ApiDetailProductManaege = (id: string) => Promise<IBaseResponse<DataProductType>>;

export type ApiDelete = (id: string) => Promise<IBaseResponse<any>>;

export type ApiUpdateProduct = (data: DataProductType) => Promise<IBaseResponse<any>>;

export type ApiCreateProduct = (data: DataProductType) => Promise<IBaseResponse<any>>;

export type ApiProductsManage = (page: number | undefined, filter: any) => Promise<IBaseResponse<PagiantionResponse<IProductManageList>>>;

export type ApiAllUser = (page: number | undefined, filter: any) => Promise<IBaseResponse<PagiantionResponse<IProfile>>>;

export type ApiVerifyCode = (code: string) => Promise<IBaseResponse<any>>;

export type ApiRefreshVerifyCode = (code: string) => Promise<IBaseResponse<any>>;

export type ApiUpdateProductWithInfo = (id: string, data: ProductInfo) => Promise<IBaseResponse<ProductInfo>>;

export type ApiGetProductInfo = (id: string) => Promise<IBaseResponse<ProductInfo>>;

export type ApiUpdateCurUser = (data: DataRequestUpdateUser) => Promise<IBaseResponse<IProfile>>;

export type ApiGetRepositories = (id: string) => Promise<IBaseResponse<RepoType[]>>;

export type ApiAddARepository = (id: string, data: RepoType) => Promise<IBaseResponse<RepoType>>;

export type ApiUpdateARepository = (data: RepoType) => Promise<IBaseResponse<RepoType>>;

export type ApiDeleteARepository = (id: number) => Promise<IBaseResponse<RepoType>>;

export type ApiGetImagesByProduct = (id: string) => Promise<IBaseResponse<IImage[]>>;

export type ApiGetPriceHistories = (id: string) => Promise<IBaseResponse<IPriceHistories[]>>;

export type ApiCreateImagesByProduct = (id: string, files: File[]) => Promise<IBaseResponse<any>>;

export type ApiDeleteImagesByProduct = (data: { id: string; idImage: number }) => Promise<IBaseResponse<any>>;

export type ApiUploadImageMessage = (images: ImageType[]) => Promise<IBaseResponse<string[]>>;

export type ApiGetUserManage = (id: string) => Promise<IBaseResponse<IUserManage>>;

export type ApiGetUserProfileMessageManage = (id: string) => Promise<IBaseResponse<IProfileMessageManage>>;

export type ApiUpdateUserManage = (data: IUserManage) => Promise<IBaseResponse<any>>;

export type ApiCreateUserManage = (data: IUserManage) => Promise<IBaseResponse<any>>;

export type ApiUpdateRoleUser = (data: { id: string; roleId: RolesName }) => Promise<IBaseResponse<any>>;

export type ApiDataChartUser = (id: string) => Promise<IBaseResponse<IRowDetailUserAdoption[]>>;

export type ApiHistories = () => Promise<IBaseResponse<IProfile>>;

export type ApiGetOrders = () => Promise<any>;

export type ApiGetFilterOrderAdmin = (data: IOrderAdminFillterForm, page: string | null) => Promise<IBaseResponse<{ orderFilters: IOrderAdminItem[]; pages: number }>>;

export type ApiUpdateReadOrderAdmin = (id: number) => Promise<IBaseResponse<IOrderAdminItem>>;

export type ApiGetDetailFilterOrderAdmin = (id: number | undefined) => Promise<IBaseResponse<IDetailOrder>>;

export type ApiUpdateStatusOrder = (data: UpdateStatusOrderType) => Promise<IBaseResponse<any>>;

export type ApiGetDefaultAddress = () => Promise<IBaseResponse<IInfoAddress>>;

export type ApiGetAddresses = () => Promise<IBaseResponse<IInfoAddress[]>>;

export type ApiGetAddressesWithUsernameByAdmin = (username: string) => Promise<IBaseResponse<IInfoAddress[]>>;

export type ApiGetAddressesById = (id: number) => Promise<IBaseResponse<IInfoAddress>>;

export type ApiHandleAddresses = (data: IInfoAddress) => Promise<IBaseResponse<IInfoAddress>>;

export type ApiCreateReivew = (data: IRequestReview) => Promise<IBaseResponse<IRequestReview>>;

export type ApiGetCartUser = () => Promise<IBaseResponse<ICart[]>>;

export type ApiUpdateCartUser = (data: ICart[]) => Promise<IBaseResponse<ICart[]>>;

export type ApiCreateCartUser = (data: ICart) => Promise<IBaseResponse<ICart>>;

export type ApiGetBrands = () => Promise<IBaseResponse<IBrand[]>>;

export type ApiUpdateSeenFeedback = (id: string) => Promise<IBaseResponse<any>>;

export type ApiGetFeedbacks = (page?: string | null) => Promise<IBaseResponse<IManageFeedbackResponse>>;

export type ApiGetReviews = (data: IReviewAdminFillterForm, page: string | null) => Promise<IBaseResponse<PagiantionResponse<IRowReviewTable>>>;

export type ApiGetReview = (id: string) => Promise<IBaseResponse<IDataDetailReview>>;

export type ApiReplayReview = (data: IReview) => Promise<IBaseResponse<any>>;

export type ApiFilterReviews = (data: { id: string; noReplay: boolean }) => Promise<IBaseResponse<IReviewHasReplay[]>>;

export type ApiActionBrand = (data: IBrand) => Promise<IBaseResponse<IBrand>>;

export type ApiProvinces<T> = (id?: string | number) => Promise<T>;

export type ApiProvincesOutside = (id?: string | number) => Promise<IProvinceOutside>;

export type ApiDevisionProvincesOutside = () => Promise<ApiDivision<IProvinceOutside[]>>;

export type ApiDevisionDistrictOutside = (data: IProvinceOutside) => Promise<ApiDivision<IDistrictOutside[]>>;

export type ApiDevisionWardOutside = (data: IDistrictOutside) => Promise<ApiDivision<IWardOutside[]>>;

export type ApiDistrictOutside = (data: IProvinceOutside, district: string) => Promise<IDistrictOutside>;

export type ApiWardOutside = (data: IDistrictOutside, ward: string) => Promise<IWardOutside>;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AddressCodeType = {
    province: number | null;
    district: number | null;
    ward: string | null;
};

export type RegisterFormData = {
    username: string;
    gender: string | boolean;
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type ProfileType = {
    fullname: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
};

export type DataRequestUpdateUser = {
    fullname: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    avatar?: string;
};

export type UpdateStatusOrderType = {
    id: number;
    status: StateType;
    reason?: string;
};

export type RowOrderSummaryUpdateStatusType = Pick<ICart, 'id' | 'image' | 'name' | 'price' | 'quantity'>;

export type SortType = string | null;

export type LocationTileType = 'center' | 'left' | 'right';

export type PagesProfileType = 'me' | 'history' | 'logout';

export type ValidateType = { message: string; error: boolean };

export type UserFormType = { username: string; password: string };
export type UserLoginWithFacebookFormType = { username: string; uuid: string; avartar: string };
export type UserLoginWithGoogleFormType = { username: string; uuid: string; avartar: string; email: string };

export type RepoType = {
    id?: number;
    size: number;
    quantity: number;
    inPrice: number;
    outPrice: number;
};
export type RepoTypeErrors = {
    size: string;
    quantity: string;
    inPrice: string;
    outPrice: string;
};

export type ModeType = 'create' | 'update';

export type RoleType = 'ROLE_USER' | 'ROLE_STAFF' | 'ROLE_ADMIN' | 'ROLE_SUPER';

export type StateType = 'placed' | 'shipping' | 'delivered' | 'cancelled' | 'cancelled_by_admin' | 'cancelled_by_customer';

export type StatusColor = {
    placed: string;
    shipping: string;
    delivered: string;
    cancelled: string;
};

export type PaymentMethod = 'cash' | 'pre-payment';

export type MenuHeaderType = {
    title: string;
    href: string;
    icon: IconProp;
};

export type HeadTabType = {
    title: string;
    icon: IconProp;
    styles?: {
        iconPosition: 'bottom' | 'top' | 'end' | 'start' | undefined;
    };
};

export type TypeNotification = 'success' | 'error' | 'warning' | 'info' | 'none';

export type TippyChooserType = {
    id: string;
    title: string;
};

export type ImageType = {
    link: string;
    data: File | null;
};

export type Point = google.maps.LatLngLiteral & { key: string; yourLocation?: boolean };

export type LabelAdopt = 'adopted' | 'waiting' | 'cancelled by admin' | 'cancelled by customer' | 'registered';
