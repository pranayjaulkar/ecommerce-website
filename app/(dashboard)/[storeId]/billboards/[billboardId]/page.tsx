import prismadb from "@/lib/prismadb";
import BillboardForm from "./(components)/BillboardForm";

export default async function BillboardPage({
  params,
}: {
  params: { billboardId: string };
}) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  const newBillboard = {
    id: billboard?.id,
    storeId: billboard?.storeId,
    label: billboard?.label,
    image: {
      secure_url: billboard?.imageUrl,
      public_id: billboard?.imagePublicId,
      signature: billboard?.imageSignature,
    },
  };
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={newBillboard} />
      </div>
    </div>
  );
}
