import React from 'react';
import {
    Container
} from '@mui/material';
import { ProfileForm } from '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/components/ProfileForm.jsx'; // Предполагается, что ProfileForm находится в ProfileForm.js

const CreateProfilePage = () => {
    const initialValues = {
        firstName: '',
        lastName: '',
        bio: '',
        avatarUrl: '',
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ProfileForm initialValues={initialValues} isEditing={false} />
        </Container>
    );
};

export default CreateProfilePage;
