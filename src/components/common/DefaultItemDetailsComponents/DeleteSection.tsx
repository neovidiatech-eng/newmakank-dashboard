// "use client";
// import { APIDelete } from "@/api/global/apiDelete";
// import { Button } from "@/components/ui/button";
// import { useParams, useRouter } from "@/lib/navigation";
// import React from "react";

// function DeleteSection({ endpoint, pathname }: { endpoint: string; pathname: string }) {
//   const { id } = useParams();
//   const router = useRouter();
//   const [disabled, setDisabled] = React.useState(false);
//   return (
//     <Button
//       disabled={disabled}
//       onClick={async () => {
//         setDisabled(true);
//         APIDelete(`${endpoint}/delete`, pathname, id);
//         router.push(pathname);
//       }}
//       type="button"
//       color="error"
//     >
//       Delete
//     </Button>
//   );
// }

// export default DeleteSection;
