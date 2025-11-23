export const metamapConfig = {
    apiKey: process.env.METAMAP_API_KEY || '',
    flowIdRecruiter: process.env.METAMAP_FLOW_ID_RECRUITER || '',
    flowIdSeeker: process.env.METAMAP_FLOW_ID_SEEKER || '',
    apiUrl: 'https://api.metamap.com/v2', // URL base de MetaMap API
};

export function isMetamapConfigured(): boolean {
    return !!(
        metamapConfig.apiKey &&
        metamapConfig.flowIdRecruiter &&
        metamapConfig.flowIdSeeker
    );
}
