"use client";
import Link from "next/link";
import { type FC } from "react";

import { LatestPost } from "~/app/_components/post";
import TemplateSelector from "~/components/template-selector";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type website } from "~/server/db/schema";
import { api } from "~/trpc/react";
// import { api, HydrateClient } from "~/trpc/server";

export default function Home() {
  // const websites = await api.website.getAll();

  // void api.website.getAll.prefetch();
  const websitesQuery = api.website.getAll.useQuery();

  return (
    // <HydrateClient>
    <main className="flex min-h-screen flex-col items-center pt-48">
      {/* <TemplateSelector /> */}
      <div className="flex min-w-[50%] flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl text-black">Your websites</h1>
          <Button asChild>
            <Link href={"/template-selector"}>Add new</Link>
          </Button>
        </div>
        {websitesQuery.isPending ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-4">
            {websitesQuery.data?.length === 0 ? (
              <div>
                <h2>No data</h2>
              </div>
            ) : (
              websitesQuery.data?.map((website) => (
                <WebsiteCard website={website} key={website.id} />
              ))
            )}
          </div>
        )}
      </div>
    </main>
    // </HydrateClient>
  );
}
const WebsiteCard: FC<{ website: typeof website.$inferSelect }> = ({
  website,
}) => {
  const utils = api.useUtils();

  const deleteWebsiteMutation = api.website.delete.useMutation({
    onSuccess: () => {
      void utils.website.invalidate(); // Refetch or update local state to reflect the deletion
    },
  });

  const deployWebsiteMutation = api.website.deploy.useMutation({
    onSuccess: () => {
      void utils.website.invalidate(); // Refetch or update local state to reflect the deployment status
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this website?")) {
      deleteWebsiteMutation.mutate({ id: id.toString() });
    }
  };

  const handleDeploy = (id: number) => {
    deployWebsiteMutation.mutate({ id: id.toString() });
  };

  return (
    <Card key={website.id} className="w-full">
      <CardHeader className="flex flex-col gap-2">
        <Badge className="ml-auto w-fit">{website.status}</Badge>
        <CardTitle>{website.title}</CardTitle>
      </CardHeader>
      {website.url && (
        <CardContent>
          <Link href={website.url} target="_blank">
            {website.url}
          </Link>
        </CardContent>
      )}
      <CardFooter className="flex justify-between gap-5">
        <p className="">{website.template}</p>
        <Button
          variant="destructive"
          onClick={() => handleDelete(website.id)}
          disabled={deleteWebsiteMutation.isPending}
        >
          {deleteWebsiteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
        {(website.status === "undeployed" || website.status === "error") && (
          <Button
            onClick={() => handleDeploy(website.id)}
            disabled={deployWebsiteMutation.isPending}
          >
            {deployWebsiteMutation.isPending ? "Deploying..." : "Deploy"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
