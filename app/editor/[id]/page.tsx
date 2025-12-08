import BoqEditor from '@/components/BoqEditor';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <BoqEditor estimateId={id} />;
}
