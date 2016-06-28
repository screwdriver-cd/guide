## Execution Engines(?)

A workload management system for the scheduling and running of jobs.  The typical enterprise requires support for multiple operating systems.  A core tenet of the project is to leverage both open source projects and commercial cloud products and their capabilities where we can. 
TODO: Tie back to targeted use cases and typical enterprise

Tier 1 supported environment is Linux and a typical use case of web serving and associated backend systems.  

Tier 2 supported environment is Mac OSX for iOS and desktop clients.  We may also support Windows in the future.

For tier 2 supported environments, we use Jenkins as our execution engine to handle scheduling across Mac OSX slaves.  Jenkins support across many OSes is useful here.

For tier 1, we are evaluating multiple options for open source release.  While Jenkins serves us well in other areas, it has issues scaling and limits overall performance with its architecture.  In addition, managing a Jenkins cluster and the slaves has high operational overhead.

### Selection Criteria

- Available outside of Yahoo
- Ease of setup
- Community momentum (leverage industry innovation and future proof our solution)
- Capabilities (semi-persistent storage, scheduler options, etc)
- Run on-premise or in cloud (AWS or GCP) 
- Operability

### Candidates

- Kubernetes (also GCP's Container Engine)
- Amazon's ECS
- Mesos
- Docker Swarm

### Initial analysis

- Amazon ECS and Kubernetes had easiest setup.  This allows users to play with the platform easily.  These also have low operational overhead (if using GCP Container Engine in Kubernetes' case) since they are cloud options.
- Kubernetes allows us to have the same interface for on-premise use as well as a native supported interface in GCP.
- ECS would limit us to Amazon and doesn't have an on-premise option.
- Mesos is used internally at Yahoo.  Getting started is more difficult. Need more time to investigate frameworks.
- Docker Swarm is a candidate but is less mature than other options.  Something to keep an eye on.

Capabilities analysis requires learning the underlying systems to a certain degree.  We decided to pick a solution and do an end to end integration to understand integration points as well as the strength and weaknesses of the system. 

Kubernetes was chosen as the first system to evaluate.

TODO: add results of evaluations
