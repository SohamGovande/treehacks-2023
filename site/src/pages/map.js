import MapPageContents from "@/components/MapPageContents";
import { DataProvider } from "@/contexts/DataContext";

export default function MapPage(props) {
  return <DataProvider {...props}><MapPageContents /></DataProvider>;
}

export const getStaticProps = async () => {
  let hotspots = require("../../assets/hotspots.json")
  let images = require('fs').readdirSync("./public/images/")
  
  return {
    props: {
      hotspots,
      images
    },
  }
}
