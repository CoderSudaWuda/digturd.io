import { Entities, Fields } from '../Const/Enums';

import GameServer from '../GameServer';
import SwiftStream from '../Utils/SwiftStream';
import Vector from '../Utils/Vector';
import Entity from './Entity';

/** A Box, an entity which blocks the player. Yields energy upon breakage. */
export class Box extends Entity {
    constructor(server: GameServer) {
        super(server, [300, 300], "Box");
        this.position = new Vector(0, 0);

        this.update.add("position");
        this.update.add("dimensions");
    }

    public tick() {
        this.update.add("position");
        this.velocity = new Vector(1, 1);
        super.tick();
    }
    
    /** Writes update information. */
    public write(buffer: SwiftStream) {
        buffer.WriteI8(Entities.Box);
        buffer.WriteI8(this.update.size + 1); // +1 for ID

        buffer.WriteI8(Fields.ID).WriteI8(this.id);

        if (this.update.has("position")) console.log("lmfao!");
        this.update.forEach(property => {
            console.log(this.position, this.dimensions);
            switch (property) {
                case "position": buffer.WriteI8(Fields.Position).WriteFloat32(this.position!.x).WriteFloat32(this.position!.y); break;
                case "dimensions": buffer.WriteI8(Fields.Dimensions).WriteFloat32(this.dimensions[0]).WriteFloat32(this.dimensions[1]); break;
            }
        });

        this.update.clear();
    }
}