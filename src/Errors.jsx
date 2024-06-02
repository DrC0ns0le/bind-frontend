import Frame from "./components/Frame";

function WrongPage() {
  return (
    <Frame location="">
      <>
        <div>
          <h1 class="text-6xl sm:text-8xl font-black tracking-tight">
            Whoops!
          </h1>
          <p class="text-2xl mt-4">
            You may have ventured too far, or something went wrong. Please try
            again.
          </p>
        </div>
      </>
    </Frame>
  );
}

export default WrongPage;
