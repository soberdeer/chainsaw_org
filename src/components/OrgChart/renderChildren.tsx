import clsx from 'clsx';
import { Group, Paper, Stack, Title } from '@mantine/core';
import { Node, NodeProps } from '@/components/Node/Node';
import classes from './OrgChart.module.css';
import { RefObject } from 'react';
import { Space } from 'react-zoomable-ui';

export const renderChildren = (node: NodeProps, groupped?: boolean): React.ReactElement => {
  const children = node.children ?? [];
  const groupedChildren = node.groupedChildren ?? [];

  const contentColSpan = Math.max(children.length * 2, groupedChildren.length * 2, 2);

  const hasSiblingRight = (childIndex: number, total: number): boolean => {
    return total > childIndex + 1;
  };

  const hasSiblingLeft = (childIndex: number): boolean => {
    return childIndex > 0;
  };

  const nodeLineBelow = (
    <td colSpan={children.length * 2} className={classes.nodeGroupCellLines}>
      <table className={classes.nodeLineTable}>
        <tbody>
          <tr>
            <td
              colSpan={2}
              className={clsx(classes.nodeLineCell, classes.nodeGroupLineVerticalMiddle)}
            />
            <td colSpan={2} className={classes.nodeLineCell} />
          </tr>
        </tbody>
      </table>
    </td>
  );

  const childrenLinesAbove = children.map((child, childIndex) => (
    <td colSpan={2} className={classes.nodeGroupCellLines} key={childIndex}>
      <table className={classes.nodeLineTable}>
        <tbody>
          <tr>
            <td
              colSpan={2}
              className={clsx(classes.nodeLineCell, classes.nodeGroupLineVerticalMiddle, {
                [classes.nodeLineBorderTop]: hasSiblingLeft(childIndex),
              })}
            />
            <td
              colSpan={2}
              className={clsx(classes.nodeLineCell, {
                [classes.nodeLineBorderTop]: hasSiblingRight(childIndex, children.length),
              })}
            />
          </tr>
        </tbody>
      </table>
    </td>
  ));

  const childNodes = children.map((child, childIndex) => (
    <td colSpan={2} className={classes.nodeGroupCell} key={childIndex}>
      {renderChildren(child)}
    </td>
  ));

  const groupedNodeLineBelow = groupedChildren.length > 0 && (
    <tr>
      <td colSpan={groupedChildren.length * 2} className={classes.nodeGroupCellLines}>
        <table className={classes.nodeLineTable}>
          <tbody>
            <tr>
              <td
                colSpan={2}
                className={clsx(classes.nodeLineCell, classes.nodeGroupLineVerticalMiddle)}
              />
              <td colSpan={2} className={classes.nodeLineCell} />
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );

  const groupedLinesAbove = groupedChildren.map((group, groupIndex) => (
    <td colSpan={2} className={classes.nodeGroupCellLines} key={`${group.name}-${groupIndex}`}>
      <table className={classes.nodeLineTable}>
        <tbody>
          <tr>
            <td
              colSpan={2}
              className={clsx(classes.nodeLineCell, classes.nodeGroupLineVerticalMiddle, {
                [classes.nodeLineBorderTop]: hasSiblingLeft(groupIndex),
              })}
            />
            <td
              colSpan={2}
              className={clsx(classes.nodeLineCell, {
                [classes.nodeLineBorderTop]: hasSiblingRight(groupIndex, groupedChildren.length),
              })}
            />
          </tr>
        </tbody>
      </table>
    </td>
  ));

  const groupedNodes = groupedChildren.map((group, groupIndex) => (
    <td colSpan={2} className={classes.nodeGroupCell} key={`${group.name}-${groupIndex}`}>
      <div
        style={{
          padding: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          minWidth: 400,
        }}
      >
        <Paper withBorder className={classes.group}>
          <Stack mt="xl" mb="md">
            <Group w="100%" px="md" justify="center">
              <Title order={2}>{group.name}</Title>
            </Group>

            {(group.children ?? []).map((child, childIndex) => (
              <div key={`${group.name}-${child.name}-${childIndex}`}>
                {renderChildren(child, true)}
              </div>
            ))}
          </Stack>
        </Paper>
      </div>
    </td>
  ));

  return (
    <table className={classes.orgNodeChildGroup}>
      <tbody>
        <tr>
          <td className={classes.nodeCell} colSpan={contentColSpan}>
            <Group justify="center">
              <Node {...node} withBorder={groupped} my={0} mx="md" />
            </Group>
          </td>
        </tr>

        {children.length > 0 && (
          <>
            <tr>{nodeLineBelow}</tr>
            <tr>{childrenLinesAbove}</tr>
            <tr>{childNodes}</tr>
          </>
        )}

        {groupedChildren.length > 0 && (
          <>
            {groupedNodeLineBelow}
            <tr>{groupedLinesAbove}</tr>
            <tr>{groupedNodes}</tr>
          </>
        )}
      </tbody>
    </table>
  );
};
