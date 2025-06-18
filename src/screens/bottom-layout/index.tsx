import Tabs from "../../components/tab";
import BImages from "../b-images";
import Bible from "../bible";
import Song from "../song";
import ThemePage from "../theme-page";

const BottomLayout = () => {
  return (
    <Tabs
      items={[
        { title: "Scripture", component: <Bible /> },
        { title: "Songs", component: <Song /> },
        { title: "Images", component: <BImages /> },
        { title: "Write-up", component: <div>Write-up</div> },
        { title: "Theme", component: <ThemePage /> },
      ]}
    />
  );
};

export default BottomLayout;
