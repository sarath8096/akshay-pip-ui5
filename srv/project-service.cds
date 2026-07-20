using { projectone.db as db } from '../db/schema';

service ProjectService {
  entity Projects as projection on db.Projects;

  entity Owners as projection on db.Owners;

  entity Tasks as projection on db.Tasks;

  @cds.redirection.target: false
  entity ProjectsList as projection on db.Projects {
    ID,
    displayId,
    name,
    status,
    priority,
    startDate,
    endDate,
    progress,
    owner.name  as ownerName,
    owner.email as ownerEmail
  };
}
