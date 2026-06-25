import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/lib/navigation";

export default function PageTransitionWrapper({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();

  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}
