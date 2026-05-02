import type { NodeProps } from '@/components/Node';
import { SpaceProvider } from '@/hooks/use-space-controller';
import { renderChildren } from './renderChildren';
import classes from './Tree.module.css';

type OrgChartProps = {
  tree: NodeProps;
};

export function Tree({ tree }: OrgChartProps) {
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
