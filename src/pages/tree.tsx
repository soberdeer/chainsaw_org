import type { GetStaticProps } from 'next';
import { getPeopleTree } from '@/server/people';
import type { NodeProps } from "@/components/Node";
import dynamic from "next/dynamic";

type HomePageProps = {
  root: NodeProps;
};

const Tree = dynamic(
  () =>
    import('@/components/Tree/Tree').then(
      (mod) => mod.Tree,
    ),
  {
    ssr: false,
  },
);


export default function HomePage({ root }: HomePageProps) {
  return <Tree tree={root} />;
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const root = await getPeopleTree();

  return {
    props: {
      root: root as unknown as NodeProps,
    },
    revalidate: 60,
  };
};