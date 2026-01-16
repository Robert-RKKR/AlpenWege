// TrackListPage.tsx

// Import application components:
import { ListModelComponent } from "../../../components/objects/list/ListModelComponent";
import type { TrackRelationModel } from "../models/trackModel";

// Config:
import { trackConfig } from "./trackConfig";

// TrackListPage:
export function TrackListPage() {
  return (
    <ListModelComponent<TrackRelationModel>
      config={trackConfig}
      api={{
        listUrl: "/api/explorers/track/",
      }}
      emptyMessage="No tracks available."
    />
  );
}
