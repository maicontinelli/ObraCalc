import PhotoReportClient from './PhotoReportClient';

export default function PhotoReportPage({ params }: { params: { id: string } }) {
    return <PhotoReportClient reportId={params.id} />;
}
