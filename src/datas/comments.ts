import { IDataDetailReview, IReview, IReviewHasReplay } from '@/configs/interface';

export const reviews = [
    {
        id: 1,
        name: 'An Yujin',
        rating: 5,
        sizes: [200],
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        createAt: new Date().toDateString(),
    },
    {
        id: 2,
        name: 'An Yujin',
        rating: 5,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 3,
        name: 'An Yujin',
        rating: 5,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 4,
        name: 'An Yujin',
        rating: 2,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 5,
        name: 'An Yujin',
        rating: 5,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 6,
        name: 'An Yujin',
        rating: 5,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 7,
        name: 'An Yujin',
        rating: 3,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
    {
        id: 8,
        name: 'An Yujin',
        rating: 4,
        sizes: [200],
        comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
        avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
        createAt: new Date().toDateString(),
    },
] as IReview[];

// interface IDataFormReview {
//     productId: string;
//     orderId: number;
//     comment: string;
//     rate: number; // 1 < rate <= 5
// }

// const formReview: IDataFormReview = {
//     productId: 'SP001',
//     orderId: 20,
//     comment: 'good product !!!',
//     rate: 5,
// };

export const detailReivewAdmin: IDataDetailReview = {
    id: 'PC0001',
    name: 'ME-O Tuna In Jelly',
    image: 'https://github.com/nkhangg/petfoster-animal-back-end-2.0/issues',
    rate: 4.8,
    detailRate: {
        five: 160,
        four: 30,
        three: 5,
        two: 3,
        one: 2,
    },
    totalRate: 200,
    reviews: [
        {
            id: 1,
            name: 'An Yujin',
            rating: 5,
            sizes: [200],
            avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
            comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
            createAt: new Date().toDateString(),
            replayItems: [
                {
                    id: 2,
                    name: 'An Yujin Replay',
                    rating: 0,
                    sizes: [],
                    avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
                    comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
                    createAt: new Date().toDateString(),
                    replayItems: null,
                },
                {
                    id: 3,
                    name: 'An Yujin Replay',
                    rating: 0,
                    sizes: [],
                    avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
                    comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
                    createAt: new Date().toDateString(),
                    replayItems: null,
                },
            ],
        },
        {
            id: 4,
            name: 'An Yujin',
            rating: 5,
            sizes: [200],
            avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
            comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
            createAt: new Date().toDateString(),
            replayItems: [
                {
                    id: 5,
                    name: 'An Yujin Replay',
                    rating: 0,
                    sizes: [],
                    avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
                    comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
                    createAt: new Date().toDateString(),
                    replayItems: null,
                },
            ],
        },
        {
            id: 6,
            name: 'An Yujin',
            rating: 5,
            sizes: [200],
            avatar: 'https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2023/04/ahn-yujin1.jpeg?fit=640%2C20000&quality=95&ssl=1',
            comment: 'The product quality is amazing. I was really pleased with the overall shopping experience',
            createAt: new Date().toDateString(),
            replayItems: null,
        },
    ],
};
