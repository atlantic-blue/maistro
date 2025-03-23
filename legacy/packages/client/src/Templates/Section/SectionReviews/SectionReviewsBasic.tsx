import React from 'react';
import { Box, Card, Flex, Text, Avatar, Heading } from '@radix-ui/themes';
import { Star } from 'lucide-react';
import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../templateTypes';
import { Review } from '../../types';

interface ReviewsDisplayProps {
    "data-hydration-id"?: string;
    targetId: string;
    fetchReviews: (targetId: string) => Promise<Review[]>;
}

const ReviewsDisplay: React.FC<ReviewsDisplayProps> = (props) => {
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        props.fetchReviews(props.targetId)
            .then(setReviews)
            .finally(() => setLoading(false));
    }, [props.targetId, props.fetchReviews]);

    if (loading) {
        return <Text>Loading reviews...</Text>;
    }

    return (
        <Box data-hydration-id={props["data-hydration-id"]}>
            <Heading size="4" mb="2">Customer Reviews</Heading>
            <Flex direction="column" gap="2">
                {reviews.map(review => (
                    <Card key={review.id}>
                        <Flex justify="between" align="center" mb="2">
                            <Flex align="center" gap="2">
                                <Avatar size="2" fallback={review.author[0]} />
                                <Text weight="bold">{review.author}</Text>
                            </Flex>
                            <Flex align="center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? 'gold' : 'none'}
                                        stroke={i < review.rating ? 'gold' : 'gray'}
                                    />
                                ))}
                            </Flex>
                        </Flex>
                        <Text>{review.comment}</Text>
                        <Text size="1" color="gray" mt="1">
                            {new Date(review.date).toLocaleDateString()}
                        </Text>
                    </Card>
                ))}
            </Flex>
        </Box>
    );
};

export const ReviewsDisplayItem: TemplateStruct<ReviewsDisplayProps> = {
    name: TemplateComponentType.REVIEWS_BASIC,
    Component: ReviewsDisplay,
    categories: [TemplateCategory.REVIEWS],
    description: "Display customer reviews",
    classNames: [],
    props: {
        targetId: "",
        fetchReviews: async () => [],
    },
};

export default ReviewsDisplay;
