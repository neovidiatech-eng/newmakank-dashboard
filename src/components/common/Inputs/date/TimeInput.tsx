import { Input } from "@/components/ui/input";
import { ComponentProps } from "react";

export default function TimeInput({ ...props }: ComponentProps<"input">): JSX.Element {
  return (
    <>
      <Input type="time" data-testid={props.name} {...props} />
    </>
  );
}
