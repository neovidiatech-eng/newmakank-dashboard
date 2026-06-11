import { ImageCell } from "./img-cell";

export default function ImageWithInfoColumn({
  logo,
  name,
  email
}: {
  logo?: string;
  name: string;
  email?: string;
}) {
  return (
    <div className="flex justify-center w-full items-center pe-12 md:pe-0">
      <div className="flex justify-between w-[30%] items-center">
        <div>{logo && <ImageCell cell={logo} />}</div>
        <div className="flex flex-col ">
          {name && <h1>{name}</h1>}
          {email && <p>{email}</p>}
        </div>
      </div>
    </div>
  );
}
