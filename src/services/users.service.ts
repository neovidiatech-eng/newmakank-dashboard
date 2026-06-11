// export interface UserStats {
//     totalUsers: number;
//     distribution: {
//         customers: number;
//         companies: number;
//     };
//     monthlyGrowth: {
//         month: string;
//         count: number;
//     }[];
// }

// // Mock data until API is ready
// export const getUserStats = async (): Promise<UserStats> => {
//     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
//     return {
//         totalUsers: 112,
//         distribution: {
//             customers: 65,
//             companies: 35
//         },
//         monthlyGrowth: [
//             { month: "Jan", count: 30 },
//             { month: "Feb", count: 40 },
//             { month: "Mar", count: 35 },
//             { month: "Apr", count: 50 },
//             { month: "May", count: 49 },
//             { month: "Jun", count: 60 }
//         ]
//     };
// };
