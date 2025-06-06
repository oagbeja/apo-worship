import Tabs from "../../components/tab";
import Bible from "../bible";
import Song from "../song";

const BottomLayout = () => {
  return (
    <Tabs
      items={[
        { title: "Scripture", component: <Bible /> },
        { title: "Songs", component: <Song /> },
        { title: "Theme", component: <div>Theme</div> },
      ]}
    />
  );
};

export default BottomLayout;
