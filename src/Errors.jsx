import { Frame } from "./components/layout";
import { PageHeading, Subheading } from "./components/ui";

function WrongPage() {
  return (
    <Frame location="">
      <>
        <div>
          <PageHeading>Whoops!</PageHeading>
          <Subheading>
            You may have ventured too far, or something went wrong. Please try
            again.
          </Subheading>
        </div>
      </>
    </Frame>
  );
}

export default WrongPage;
