import { Frame } from "./components/layout";
import { PageHeading, Subheading } from "./components/ui";

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
