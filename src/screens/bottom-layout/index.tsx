import Tabs from "../../components/tab";
import Bible from "../bible";
import Song from "../song";
import ThemePage from "../theme-page";

const BottomLayout = () => {
  return (
    <Tabs
      items={[
        { title: "Scripture", component: <Bible /> },
        { title: "Songs", component: <Song /> },
        { title: "Presentation", component: <div>Presentation</div> },
        { title: "Theme", component: <ThemePage /> },
      ]}
    />
  );
};

export default BottomLayout;
