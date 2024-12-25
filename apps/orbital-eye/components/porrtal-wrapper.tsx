import styles from './porrtal-wrapper.module.scss';
import { View } from "@porrtal/r-api";
import { BannerData, ShellState } from "@porrtal/r-shell";
import { ShellMaterial } from "@porrtal/r-shell-material";

export function PorrtalWrapper() {
  const porrtalViews: View[] = [
    {
      key: "OrbitVisualizer",
      launchAtStartup: true,
      displayText: "Orbit Visualizer",
      paneType: "main",
      displayIcon: "satellite_alt",
      componentName: "OrbitVisualizer",
      componentModule: () => import("@orbital-eye/e01-visualize"),
    },
  ];
  const porrtalBanner: BannerData = {
    displayText: "Orbital Eye",
    displayIcon: "public",
    childData: []
  };
  return (
    <ShellState views={porrtalViews}>
      <ShellMaterial bannerData={porrtalBanner} />
    </ShellState>
  );}

export default PorrtalWrapper;
