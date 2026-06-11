import React from "react";

const CustomerInfoComponent: React.FC<{
  name: string;
  phone: string;
}> = ({ name, phone }) => {
  return (
    <div className="flex items-center flex-col">
      <h1>{name}</h1>
      <h1 dir="ltr" className="text-end text-gray-400 hover:text-primary duration-300">
        {phone}
      </h1>
    </div>
  );
};

export default CustomerInfoComponent;
