import { Suspense } from 'react';
import BoqEditor from '@/components/BoqEditor';

export default async function EditorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<div className="p-8 text-center">Carregando editor...</div>}>
                <BoqEditor estimateId={id} />
            </Suspense>
        </div>
    );
}
