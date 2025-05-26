/* eslint-disable */
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Heading,
  Text,
  Flex,
  Card,
  Button,
  Badge,
  Progress,
  Separator,
  Link,
} from '@maistro/ui';
import { courses } from '../data/initialCourse';
import { useState } from 'react';
import useLocalProgress from '@/Components/Course/useLocalProgress';
import { CheckCircledIcon, ClockIcon, TriangleRightIcon } from '@radix-ui/react-icons';

const CourseLayout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courseId ? courses[courseId] : courses[''];

  const { getCourseProgressPercentage, getModuleProgress } = useLocalProgress(
    course.id,
    course.modules.length
  );

  const totalModules = course.modules.length;
  const courseProgressPercentage = getCourseProgressPercentage();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([course.modules[0].id])
  );

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }

      return newSet;
    });
  };

  const findNextCourseModule = () => {
    for (const module of course.modules) {
      const moduleProgress = getModuleProgress(module.id);
      if (!moduleProgress.completed) {
        return module;
      }
    }
  };

  const navigateToNextModule = () => {
    const nextCourseModule = findNextCourseModule();
    if (nextCourseModule) {
      navigate(`/courses/${course.id}/${nextCourseModule.id}`);
    }
  };

  return (
    <Box p="4">
      <Flex className="flex-col">
        <Box pb="3">
          <Heading className="text-5xl" align="center">
            {course.title}
          </Heading>
          <Text as="p" size="5" color="gray" align="center">
            {course.description}
          </Text>

          <Flex align="center" gap="4" justify="center">
            <Text as="p" size="2" color="gray">
              Instructor: {course.instructor}
            </Text>
            <Text as="p" size="2" color="gray">
              {totalModules} Modulos
            </Text>
          </Flex>
        </Box>

        <Button
          onClick={navigateToNextModule}
          size="3"
          color={courseProgressPercentage > 0 ? 'green' : 'amber'}
          className="mb-4"
        >
          {courseProgressPercentage === 0 ? 'Empezar' : 'Continuar'} curso
        </Button>

        <Card size="2" mb="5">
          <Box p="4">
            <Flex justify="between" align="center" mb="2">
              <Heading size="3">Your Progress</Heading>
              <Badge size="2" color="indigo" variant="soft">
                {courseProgressPercentage}% Complete
              </Badge>
            </Flex>

            <Progress value={courseProgressPercentage} color="indigo" />
          </Box>
        </Card>

        <Heading size="4" mb="3">
          Course Content
        </Heading>

        {course.modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const moduleProgress = getModuleProgress(module.id);
          return (
            <Card key={module.id} size="2" mb="3">
              <Box p="0">
                <Box
                  p="3"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? 'var(--gray-2)' : 'transparent',
                  }}
                  onClick={() => toggleModuleExpansion(module.id)}
                >
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      {moduleProgress.completed ? (
                        <CheckCircledIcon color="var(--green-9)" />
                      ) : (
                        <TriangleRightIcon />
                      )}
                      <Text weight="bold">{module.title}</Text>
                    </Flex>
                  </Flex>
                </Box>

                {isExpanded && (
                  <Box>
                    <Separator size="4" />

                    <Box p="3">
                      <Text as="p" size="2" mb="3" align="center">
                        {module.description}
                      </Text>
                      <Box
                        p="2"
                        style={{
                          borderRadius: 'var(--radius-2)',
                          backgroundColor: moduleProgress.completed
                            ? 'var(--gray-2)'
                            : 'transparent',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/courses/${course.id}/${module.id}`)}
                      >
                        <Flex direction="column" justify="center" align="center">
                          <Box
                            style={{
                              backgroundImage: `url(${module.thumbnail})`,
                              width: '100%',
                              maxWidth: "300px",
                              aspectRatio: '10 / 7',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: '8px',
                            }}
                          />

                          <Flex align="center" gap="1" className="mt-3">
                            <ClockIcon />
                            <Text size="1">{module.duration}</Text>
                          </Flex>
                        </Flex>
                      </Box>

                      <Flex gap="3" direction="column" align="center">
                        {module.links &&
                          module.links.map((link) => {
                            return (
                              <Link href={link.href} target="_blank">
                                {link.title}
                              </Link>
                            );
                          })}
                      </Flex>
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
};

export default CourseLayout;
