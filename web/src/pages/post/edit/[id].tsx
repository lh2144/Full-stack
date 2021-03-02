import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "src/components/inputField";
import { usePostQuery, useUpdatePostMutation } from "src/generated/graphqa";
import { useGetIntId } from "src/utils/useGetIntId";
import { withApollo } from "src/utils/withApollo";
import { Layout } from "../../../components/Layout";

const EditPost = ({}) => {
    const router = useRouter();
    const intId = useGetIntId();
    const { data, loading } = usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
    const [updatePost] = useUpdatePostMutation();

    if (loading) {
        return (
            <Layout>
                <div> Loading...</div>
            </Layout>
        );
    }
    if (!data?.post) {
        return (
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        );
    }

    return (
        <Layout variant="small">
            <Formik
                initialValues={{
                    title: data.post.title,
                    text: data?.post?.text,
                }}
                onSubmit={async (values) => {
                    await updatePost({ variables: { id: intId, ...values } });
                    router.back();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="text..."
                                label="Body"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        >
                            update post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withApollo({ ssr: false })(EditPost);
