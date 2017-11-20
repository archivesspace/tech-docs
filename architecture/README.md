# ArchivesSpace architecture and components

ArchivesSpace is divided into several components: the backend, which
exposes the major workflows and data types of the system via a
REST API, a staff interface, a public interface, and a search system,
consisting of Solr and an indexer application.

These components interact by exchanging JSON data.  The format of this
data is defined by a class called JSONModel.

* [JSONModel -- a validated ArchivesSpace record](./jsonmodel.md)
* [The ArchivesSpace backend](./backend.md)
* [Background Jobs](./background_jobs.md)
* [Working with the ArchivesSpace API](./api.md)
* [Search indexing](./search.md)
* [The ArchivesSpace public user interface](./public.md)
* [OAI-PMH interface](./oai-pmh.md)
