import { useRef } from 'react';
import { Space } from 'react-zoomable-ui';
import { NodeProps } from '@/components/Node/Node';
import { renderChildren } from '@/components/OrgChart/renderChildren';
import classes from './OrgChart.module.css';
import { SpaceProvider } from '@/hooks/use-space-controller';

type OrgChartProps = {
  tree: NodeProps;
};

export function OrgChart({ tree }: OrgChartProps) {
  return (
    <>
      <SpaceProvider>
        <div id="org-chart" className={classes.reactOrgChart}>
          {renderChildren(tree)}
        </div>
      </SpaceProvider>
    </>
  );
}
