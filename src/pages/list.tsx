import { Container, Title } from '@mantine/core';
import type { GetStaticProps } from 'next';
import { UsersListTable } from '@/components/UsersListTable/UsersListTable';
import { getPeopleListData, type DepartmentMap, type PersonListRow } from '@/server/peopleList';

type ListPageProps = {
  users: PersonListRow[];
  departmentMap: DepartmentMap;
};

export default function ListPage({ users, departmentMap }: ListPageProps) {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">
        Участники
      </Title>

      <UsersListTable users={users} departmentMap={departmentMap} />
    </Container>
  );
}

export const getStaticProps: GetStaticProps<ListPageProps> = async () => {
  const { users, departmentMap } = await getPeopleListData();

  return {
    props: {
      users,
      departmentMap,
    },
    revalidate: 60,
  };
};
