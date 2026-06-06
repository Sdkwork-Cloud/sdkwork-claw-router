/** Memory space item schema exposed by Claw Router. */
export interface MemorySpaceItem {
  /** Auto extract enabled field on memory space item. */
  autoExtractEnabled: boolean;
  /** Auto recall enabled field on memory space item. */
  autoRecallEnabled: boolean;
  /** Created at field on memory space item. */
  createdAt: string;
  /** Entry count field on memory space item. */
  entryCount: string;
  /** Id field on memory space item. */
  id: string;
  /** Max injected tokens field on memory space item. */
  maxInjectedTokens?: string | null;
  /** Memory enabled field on memory space item. */
  memoryEnabled: boolean;
  /** Owner id field on memory space item. */
  ownerId?: string | null;
  /** Owner type field on memory space item. */
  ownerType?: string | null;
  /** Review required field on memory space item. */
  reviewRequired: boolean;
  /** Space type field on memory space item. */
  spaceType: string;
  /** Status field on memory space item. */
  status: string;
  /** Title field on memory space item. */
  title: string;
  /** Updated at field on memory space item. */
  updatedAt: string;
}
