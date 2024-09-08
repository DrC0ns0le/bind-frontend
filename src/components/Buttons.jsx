import React, { useState } from "react";

function BigButton1(props) {
  const { option, value, onClick } = props;

  const onClickHandler = () => {
    onClick(option);
  };

  return (
    <button
      class="font-medium py-2 md:px-4 rounded-[8px] transition ease-in-out md:mr-5 mb-5 active:scale-95 shadow-gb1 hover:shadow-gba1 w-[350px] h-[100px] text-xl"
      onClick={() => {
        onClickHandler();
      }}
    >
      {value}
    </button>
  );
}

export default BigButton1;
