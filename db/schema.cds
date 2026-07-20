using { cuid } from '@sap/cds/common';

namespace projectone.db;

entity Owners : cuid {
  email : String(241);
  name  : String(111);
}

entity Projects : cuid {
  displayId        : String(20);
  name             : String(111) not null;
  status           : String(20);
  priority         : String(20);
  startDate        : Date;
  endDate          : Date;
  progress         : Integer default 0;
  shortDescription : String(50);
  longDescription  : String(255);
  owner            : Association to Owners not null;
  tasks            : Composition of many Tasks
                        on tasks.project = $self;
}

entity Tasks : cuid {
  displayId : String(10);
  title     : String(111) not null;
  status    : String(20);
  startDate : Date;
  endDate   : Date;
  assignee  : Association to Owners;
  project   : Association to Projects;
}