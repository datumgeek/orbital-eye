import { JotaiDataHost } from '@orbital-eye/e02-visualize';
import styles from './porrtal-wrapper.module.scss';
import { View } from '@porrtal/r-api';
import { BannerData, ShellState } from '@porrtal/r-shell';
import { ShellMaterial } from '@porrtal/r-shell-material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

export function E02PorrtalWrapper() {
  const porrtalViews: View[] = [
    {
      key: 'ConjunctionList',
      launchAtStartup: true,
      displayText: 'Conjunction List',
      paneType: 'nav',
      displayIcon: 'compare_arrows',
      componentName: 'ConjunctionList',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      key: 'SatelliteSearch',
      launchAtStartup: true,
      displayText: 'Satellite Search',
      paneType: 'search',
      displayIcon: 'satellite_alt',
      componentName: 'SatelliteSearch',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      viewId: 'SatelliteDetails',
      key: 'SatelliteDetails {noradCatId}',
      launchAtStartup: false,
      displayText: '{objectName}',
      entityTypeMenuText: 'Satellite Details',
      paneType: 'main',
      displayIcon: 'satellite_alt',
      entityType: 'satellite',
      componentName: 'SatelliteDetails',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      viewId: 'SatelliteDetailsInNav',
      key: 'SatelliteDetailsInNav',
      launchAtStartup: false,
      displayText: '{objectName}',
      entityTypeMenuText: 'Satellite Details',
      paneType: 'right',
      displayIcon: 'satellite_alt',
      entityType: 'satellite',
      componentName: 'SatelliteDetails',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      viewId: 'ConjunctionDetails',
      key: 'ConjunctionDetails {cdmId}',
      launchAtStartup: false,
      displayText: '{objectName}',
      entityTypeMenuText: 'Conjunction Details',
      paneType: 'main',
      displayIcon: 'compare_arrows',
      entityType: 'conjunction',
      componentName: 'ConjunctionDetails',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      key: 'ProjectInfo',
      launchAtStartup: true,
      displayText: 'Project Info',
      paneType: 'main',
      menu: 'e02.project-info',
      displayIcon: 'info',
      componentName: 'ProjectInfo',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      key: 'OrbitVisualizer',
      launchAtStartup: false,
      displayText: 'Orbit Visualizer',
      paneType: 'main',
      menu: 'e01.orbit-visualizer',
      displayIcon: 'satellite_alt',
      componentName: 'OrbitVisualizer',
      componentModule: () => import('@orbital-eye/e01-visualize'),
    },
    {
      key: 'GlobalSatelliteViz {id}',
      launchAtStartup: true,
      displayText: 'Global Satellites',
      paneType: 'main',
      menu: 'e02.global-satellites',
      displayIcon: 'public',
      entityType: 'satellite',
      componentName: 'TimeSliceViz',
      componentModule: () => import('@orbital-eye/e02-visualize'),
    },
    {
      key: 'BoxScore',
      launchAtStartup: false,
      displayText: 'Box Score',
      paneType: 'main',
      menu: 'e01.box-scores',
      displayIcon: 'shelves',
      componentName: 'BoxScore',
      componentModule: () => import('@orbital-eye/e01-visualize'),
    },
    // {
    //   key: 'md{id}',
    //   launchAtStartup: false,
    //   paneType: 'main',
    //   displayText: 'Markdown Viewer',
    //   displayIcon: 'book',
    //   componentName: 'MarkdownViewer',
    //   componentModule: () => import('@porrtal-components/r-learning'),
    //   state: {
    //     id: 'e02',
    //     contentUrl: 'docs/Sample-E02.md'
    //   }
    // }
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
    <JotaiDataHost>
      <ShellState views={porrtalViews}>
        <ShellMaterial bannerData={porrtalBanner} />
      </ShellState>
    </JotaiDataHost>
  );
}

export default E02PorrtalWrapper;
