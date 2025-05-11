/* eslint-disable */
import { Box, Card, Flex, Heading, Text, Button } from '@maistro/ui';
import { useNavigate } from 'react-router';
import { featuredCourse } from '../data/initialCourse';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box p="4">
      <Heading size="6" mb="4">
        Bienvenidos a Maistro Academy
      </Heading>

      <Box mb="6">
        <Heading size="4" mb="3">
          Curso Destacado
        </Heading>
        <Card size="2" className="flex flex-col items-center">
          <Box
            style={{
              width: '240px',
              height: '135px',
              backgroundImage: `url(${featuredCourse.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box p="4" className="flex flex-col">
            <Heading size="3" mb="2">
              {featuredCourse.title}
            </Heading>
            <Text as="p" size="2" mb="3">
              {featuredCourse.description}
            </Text>
            <Flex gap="3" mt="3">
              <Text size="1" color="gray">
                {featuredCourse.modules[0].duration}
              </Text>
              <Text size="1" color="gray">
                By {featuredCourse.instructor}
              </Text>
            </Flex>
            <Button size="2" mt="3" onClick={() => navigate(`/courses/${featuredCourse.id}`)}>
              Watch Now
            </Button>
          </Box>
        </Card>
      </Box>

      <Box>
        <Heading size="4" mb="3">
          Proximamente
        </Heading>
        <Card size="2">
          <Box p="4">
            <Text as="p" color="gray">
              More courses are being prepared. Stay tuned!
            </Text>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
