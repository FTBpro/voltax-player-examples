import { PlayerCard } from "../../components/PlayerCard"
import { SHARED_PLAYER } from "../../constants/sharedPlayer"
import { SharedHeader } from "./SharedHeader"

export const PageOne = () => {
  return (
    <>
      <SharedHeader />
      <div className="shared-player-host">
        <PlayerCard
          title={`Shared Hero Player on Page One in container with id '${SHARED_PLAYER.containerId}'`}
          description={`This player was embedded using the embed code (div with script tag after it) in Container id: ${SHARED_PLAYER.containerId}`}
          externalID={SHARED_PLAYER.externalID}
          defaultPlayerKey={SHARED_PLAYER.defaultContentId}
          containerId={SHARED_PLAYER.containerId}
        />
      </div>
    </>
  )
}