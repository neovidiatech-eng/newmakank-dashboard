// import { fetchHelper } from "@/api/fetch";
// import { endpoints } from "@/utils/endpoints";

// export interface DashboardStats {
//   usersCount: number;
//   activeUsers: number;
//   customersCount: number;
//   companiesCount: number;
//   offersCount: number;
//   couponsCount: number;
//   categoriesCount: number;
//   adsCount: number;
//   notificationsCount: number;
//   servicesCount: number;
// }

// export interface UserTypeDistribution {
//   type: string;
//   count: number;
//   percentage: number;
// }

// export interface MonthlyGrowth {
//   month: string;
//   users: number;
//   offers: number;
//   companies: number;
// }

// // Get comprehensive dashboard statistics
// export const getDashboardStats = async (): Promise<DashboardStats> => {
//   try {
//     // Fetch data from multiple endpoints
//     const [
//       usersResponse,
//       customersResponse,
//       companiesResponse,
//       offersResponse,
//       couponsResponse,
//       categoriesResponse,
//       adsResponse,
//       notificationsResponse,
//       servicesResponse
//     ] = await Promise.all([
//     ]);

//     // Calculate active users (assuming users with status 'ACTIVE' or similar)
//     const activeUsersResponse = await fetchHelper({
//       method: "GET",
//       params: { active: true, limit: 1 }
//     });

//     return {
//       usersCount: usersResponse?.total || 0,
//       activeUsers: activeUsersResponse?.total || Math.floor((usersResponse?.total || 0) * 0.7), // fallback to 70% if no specific endpoint
//       customersCount: customersResponse?.total || 0,
//       companiesCount: companiesResponse?.total || 0,
//       offersCount: offersResponse?.total || 0,
//       couponsCount: couponsResponse?.total || 0,
//       categoriesCount: categoriesResponse?.total || 0,
//       adsCount: adsResponse?.total || 0,
//       notificationsCount: notificationsResponse?.total || 0,
//       servicesCount: servicesResponse?.total || 0
//     };
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);
//     // Return fallback data
//     return {
//       usersCount: 0,
//       activeUsers: 0,
//       customersCount: 0,
//       companiesCount: 0,
//       offersCount: 0,
//       couponsCount: 0,
//       categoriesCount: 0,
//       adsCount: 0,
//       notificationsCount: 0,
//       servicesCount: 0
//     };
//   }
// };

// // Get user type distribution
// export const getUserTypeDistribution = async (): Promise<UserTypeDistribution[]> => {
//   try {
//     const [customersResponse, companiesResponse] = await Promise.all([
//     ]);

//     const customersCount = customersResponse?.total || 0;
//     const companiesCount = companiesResponse?.total || 0;
//     const totalUsers = customersCount + companiesCount;

//     if (totalUsers === 0) return [];

//     return [
//       {
//         type: "CUSTOMER",
//         count: customersCount,
//         percentage: Math.round((customersCount / totalUsers) * 100)
//       },
//       {
//         type: "COMPANY",
//         count: companiesCount,
//         percentage: Math.round((companiesCount / totalUsers) * 100)
//       }
//     ];
//   } catch (error) {
//     console.error("Error fetching user distribution:", error);
//     return [];
//   }
// };

// // Get recent activity/growth data
// export const getRecentActivity = async () => {
//   try {
//     // Get recent users, offers, and companies
//     const [recentUsers, recentOffers, recentCompanies] = await Promise.all([
//       fetchHelper({
//         method: "GET",
//         params: { limit: 10, sortBy: "createdAt", sortOrder: "desc" }
//       }),
//       fetchHelper({
//         method: "GET",
//         params: { limit: 10, sortBy: "createdAt", sortOrder: "desc" }
//       }),
//       fetchHelper({
//         method: "GET",
//         params: { limit: 10, sortBy: "createdAt", sortOrder: "desc" }
//       })
//     ]);

//     return {
//       recentUsers: recentUsers?.data || [],
//       recentOffers: recentOffers?.data || [],
//       recentCompanies: recentCompanies?.data || []
//     };
//   } catch (error) {
//     console.error("Error fetching recent activity:", error);
//     return {
//       recentUsers: [],
//       recentOffers: [],
//       recentCompanies: []
//     };
//   }
// };
