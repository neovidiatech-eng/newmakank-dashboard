import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { TfiBackRight } from "react-icons/tfi";
function BackButton() {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()}>
      <TfiBackRight />
    </Button>
  );
}

export default BackButton;
