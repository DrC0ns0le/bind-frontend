import Frame from "./components/Frame";
import { PageHeading, Subheading } from "./components/Typography";

function Home() {
  return (
    <Frame location="home">
      <>
        <div>
          <PageHeading>Home</PageHeading>
          <Subheading>DNS Management Web Management</Subheading>
        </div>
      </>
    </Frame>
  );
}

export default Home;
