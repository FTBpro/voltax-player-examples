import { PlayerCard } from "../../components/PlayerCard"
import { SHARED_PLAYER } from "../../constants/sharedPlayer"
import { SharedHeader } from "./SharedHeader"

export const PageTwo = () => {
  return (
    <>
      <SharedHeader />
      <div className="shared-player-host flex-row">
        <div className="note">
      This is the same player instace as in Page One, but in a different container.
      Container id: {SHARED_PLAYER.secondaryContainerId}
        </div>
        <PlayerCard
          title={`Shared Hero Player on Page Two in container with id '${SHARED_PLAYER.secondaryContainerId}'`}
          description="This player was embedded using the embed code (div with script tag after it) and reuses the player from Page One injected into a different container ."
          externalID={SHARED_PLAYER.externalID}
          defaultContentID={SHARED_PLAYER.defaultContentId}
          containerId={SHARED_PLAYER.secondaryContainerId}
          orgID={SHARED_PLAYER.orgID}
          propertyID={SHARED_PLAYER.propertyID}
        />
      </div>
    </>
  )
}