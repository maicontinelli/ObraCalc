import PhotoReportClient from './PhotoReportClient';

export default async function PhotoReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PhotoReportClient reportId={id} />;
}
