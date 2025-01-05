import styles from './porrtal-wrapper.module.scss';
import { View } from "@porrtal/r-api";
import { BannerData, ShellState } from "@porrtal/r-shell";
import { ShellMaterial } from "@porrtal/r-shell-material";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

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
    {
      key: "BoxScore",
      launchAtStartup: true,
      displayText: "Box Score",
      paneType: "main",
      displayIcon: "shelves",
      componentName: "BoxScore",
      componentModule: () => import("@orbital-eye/e01-visualize"),
    },
  ];
  const basePath = window.location.pathname.startsWith('/orbital-eye')
    ? '/orbital-eye'
    : '';

  const porrtalBanner: BannerData = {
    displayText: 'Orbital Eye',
    displayIcon: 'public',
    childData: [
      {
        displayIcon: 'satellite_alt',
        displayText: 'e02 Sample',
        targetUrl: `${basePath}/e02`,
      },
      {
        displayIcon: 'satellite_alt',
        displayText: 'portal Sample',
        targetUrl: `${basePath}/portal`,
      },
      {
        displayIcon: 'satellite_alt',
        displayText: 'Simple Demo',
        targetUrl: `${basePath}/`,
      },
    ],
  };
  return (
    <ShellState views={porrtalViews}>
      <ShellMaterial bannerData={porrtalBanner} />
    </ShellState>
  );}

export default PorrtalWrapper;
