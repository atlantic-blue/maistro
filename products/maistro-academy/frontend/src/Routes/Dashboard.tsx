/* eslint-disable */
import { Box, Card, Flex, Heading, Text, Button } from '@maistro/ui';
import { useNavigate } from 'react-router';
import { contenidoConPoder, offertasConPoder } from '../data/initialCourse';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box p="4">
      <Heading size="6" mb="4">
        Bienvenidos a Maistro Academy
      </Heading>

      <Box mb="6">
        <Heading size="4" mb="3">
          Cursos Destacado
        </Heading>
        <Flex gap="2" align="center" justify="center" wrap="wrap">
          <Card size="2" className="flex flex-col items-center max-w-[320px]">
            <Box
              style={{
                width: '240px',
                height: '135px',
                backgroundImage: `url(${contenidoConPoder.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Box p="4" className="flex flex-col">
              <Heading size="3" mb="2">
                {contenidoConPoder.title}
              </Heading>
              <Text as="p" size="2" mb="3">
                {contenidoConPoder.description}
              </Text>
              <Flex gap="3" mt="3">
                <Text size="1" color="gray">
                  {contenidoConPoder.modules[0].duration}
                </Text>
                <Text size="1" color="gray">
                  By {contenidoConPoder.instructor}
                </Text>
              </Flex>
              <Button size="2" mt="3" onClick={() => navigate(`/courses/${contenidoConPoder.id}`)}>
                ver ahora
              </Button>
            </Box>
          </Card>

          <Card size="2" className="flex flex-col items-center max-w-[320px]">
            <Box
              style={{
                width: '144px',
                height: '118px',
                backgroundImage: `url(${offertasConPoder.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Box p="4" className="flex flex-col">
              <Heading size="3" mb="2">
                {offertasConPoder.title}
              </Heading>
              <Text as="p" size="2" mb="3">
                {offertasConPoder.description}
              </Text>
              <Flex gap="3" mt="3">
                <Text size="1" color="gray">
                  {offertasConPoder.modules[0].duration}
                </Text>
                <Text size="1" color="gray">
                  By {offertasConPoder.instructor}
                </Text>
              </Flex>
              <Button size="2" mt="3" onClick={() => navigate(`/courses/${offertasConPoder.id}`)}>
                ver ahora
              </Button>
            </Box>
          </Card>
        </Flex>
      </Box>

      <Box>
        <Heading size="4" mb="3">
          Proximamente
        </Heading>
        <Card size="2">
          <Box p="4">
            <Text as="p" color="gray">
              Embudos con poder! Si ya tienes una pagina web o estas a punto de tenerla, este curso
              es para ti. No basta con tener un web bonita, necesitas que convierta 🧲
            </Text>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
