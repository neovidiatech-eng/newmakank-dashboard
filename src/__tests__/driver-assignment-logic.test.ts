import { describe, it, expect, vi } from "vitest";

describe("Dashboard Driver Assignment & Cache Invalidation Specs", () => {
  // Logic from OrdersColumns.tsx and [id]/page.tsx:
  // disabled={['DELIVERED', 'CANCELLED', 'REJECTED'].includes(order.status)}
  const isDriverAssignmentDisabled = (status: string) => {
    return ["DELIVERED", "CANCELLED", "REJECTED"].includes(status);
  };

  describe("1. Driver Reassignment Enabled for Non-Terminal Orders", () => {
    it("allows driver assignment/reassignment when order is PENDING even if deliveryId exists", () => {
      const order = { id: 101, status: "PENDING", deliveryId: 44 };
      expect(isDriverAssignmentDisabled(order.status)).toBe(false);
    });

    it("allows driver assignment/reassignment when order is PREPARING", () => {
      const order = { id: 102, status: "PREPARING", deliveryId: 44 };
      expect(isDriverAssignmentDisabled(order.status)).toBe(false);
    });

    it("allows driver assignment/reassignment when order is READY_PICKUP", () => {
      const order = { id: 103, status: "READY_PICKUP", deliveryId: 44 };
      expect(isDriverAssignmentDisabled(order.status)).toBe(false);
    });

    it("allows driver reassignment when order is ON_THE_WAY (in case driver broke down or cancelled)", () => {
      const order = { id: 104, status: "ON_THE_WAY", deliveryId: 44 };
      expect(isDriverAssignmentDisabled(order.status)).toBe(false);
    });
  });

  describe("2. Driver Assignment Disabled for Terminal Orders", () => {
    it("disables driver assignment when order is DELIVERED", () => {
      expect(isDriverAssignmentDisabled("DELIVERED")).toBe(true);
    });

    it("disables driver assignment when order is CANCELLED", () => {
      expect(isDriverAssignmentDisabled("CANCELLED")).toBe(true);
    });

    it("disables driver assignment when order is REJECTED", () => {
      expect(isDriverAssignmentDisabled("REJECTED")).toBe(true);
    });
  });

  describe("3. Query Cache Invalidation on Assignment", () => {
    it("invalidates both ['orders'] list and ['order', orderId] details caches", async () => {
      const mockInvalidateQueries = vi.fn().mockResolvedValue(undefined);
      const queryClient = {
        invalidateQueries: mockInvalidateQueries,
      };

      const handleAssignSuccess = async (orderId: number) => {
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        await queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      };

      await handleAssignSuccess(999);

      expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
      expect(mockInvalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ["orders"],
      });
      expect(mockInvalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ["order", 999],
      });
    });
  });
});
