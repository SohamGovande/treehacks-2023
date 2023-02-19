import MapPageContents from "@/components/MapPageContents";
import { DataProvider } from "@/contexts/DataContext";

export default function MapPage({ hotspots }) {
  return <DataProvider hotspots={hotspots}><MapPageContents /></DataProvider>;
}

export const getStaticProps = async () => {
  let hotspots = require('../../assets/hotspots.json')
  hotspots = [hotspots[9]]
  return {
    props: {
      hotspots
    },
  }
}