# Overall Code Status

| System           | Version | Build | Dependencies |
| :--------------- | :------ | :---- | :----------- |
| API              | [![v][api-veri]][api-veru] | [![bld][api-bldi]][api-bldu] | [![dep][api-depi]][api-depu] |
| Models           | [![v][models-veri]][models-veru] | [![bld][models-bldi]][models-bldu] | [![dep][models-depi]][models-depu] |
| Data Schema      | [![v][schema-veri]][schema-veru] | [![bld][schema-bldi]][schema-bldu] | [![dep][schema-depi]][schema-depu] |
| Executor - Base  | [![v][ebase-veri]][ebase-veru] | [![bld][ebase-bldi]][ebase-bldu] | [![dep][ebase-depi]][ebase-depu] |
| Executor - K8s   | [![v][k8s-veri]][k8s-veru] | [![bld][k8s-bldi]][k8s-bldu] | [![dep][k8s-depi]][k8s-depu] |
| Datastore - Base | [![v][dbase-veri]][dbase-veru] | [![bld][dbase-bldi]][dbase-bldu] | [![dep][dbase-depi]][dbase-depu] |
| Datastore - IMDB | [![v][imdb-veri]][imdb-veru] | [![bld][imdb-bldi]][imdb-bldu] | [![dep][imdb-depi]][imdb-depu] |
| Datastore - DyDB | [![v][dydb-veri]][dydb-veru] | [![bld][dydb-bldi]][dydb-bldu] | [![dep][dydb-depi]][dydb-depu] |
| Config Parser    | [![v][cfg-veri]][cfg-veru] | [![bld][cfg-bldi]][cfg-bldu] | [![dep][cfg-depi]][cfg-depu] |
| Circuit Fuses    | [![v][fuse-veri]][fuse-veru] | [![bld][fuse-bldi]][fuse-bldu] | [![dep][fuse-depi]][fuse-depu] |
| Keymbinatorial   | [![v][keyb-veri]][keyb-veru] | [![bld][keyb-bldi]][keyb-bldu] | [![dep][keyb-depi]][keyb-depu] |
| Yeoman Generator | [![v][yo-veri]][yo-veru] | [![bld][yo-bldi]][yo-bldu] | [![dep][yo-depi]][yo-depu] |
| ESLint Config    | [![v][lint-veri]][lint-veru] | [![bld][lint-bldi]][lint-bldu] | [![dep][lint-depi]][lint-depu] |
| Launcher         | [![v][lnch-veri]][lnch-veru] | [![bld][lnch-bldi]][lnch-bldu] | |
| GitVersion       | [![v][gitv-veri]][gitv-veru] | [![bld][gitv-bldi]][gitv-bldu] | |
| Job Tools        | [![v][jobt-veri]][jobt-veru] | | |

_todo: client, guide_

[api-veri]: https://img.shields.io/npm/v/screwdriver-api.svg
[api-veru]: https://npmjs.org/package/screwdriver-api
[api-bldi]: https://app.wercker.com/status/10229771f62f565cd62622ef56f0ca6d
[api-bldu]: https://app.wercker.com/project/bykey/10229771f62f565cd62622ef56f0ca6d
[api-depi]: https://david-dm.org/screwdriver-cd/screwdriver.svg?theme=shields.io
[api-depu]: https://david-dm.org/screwdriver-cd/screwdriver

[models-veri]: https://img.shields.io/npm/v/screwdriver-models.svg
[models-veru]: https://npmjs.org/package/screwdriver-models
[models-bldi]: https://app.wercker.com/status/b397acf533ad968db3955e1b2e834c8b
[models-bldu]: https://app.wercker.com/project/bykey/b397acf533ad968db3955e1b2e834c8b
[models-depi]: https://david-dm.org/screwdriver-cd/models.svg?theme=shields.io
[models-depu]: https://david-dm.org/screwdriver-cd/models

[schema-veri]: https://img.shields.io/npm/v/screwdriver-data-schema.svg
[schema-veru]: https://npmjs.org/package/screwdriver-data-schema
[schema-bldi]: https://app.wercker.com/status/5af7b45967fcef5a8769b23c0f150040
[schema-bldu]: https://app.wercker.com/project/bykey/5af7b45967fcef5a8769b23c0f150040
[schema-depi]: https://david-dm.org/screwdriver-cd/data-schema.svg?theme=shields.io
[schema-depu]: https://david-dm.org/screwdriver-cd/data-schema

[ebase-veri]: https://img.shields.io/npm/v/screwdriver-executor-base.svg
[ebase-veru]: https://npmjs.org/package/screwdriver-executor-base
[ebase-bldi]: https://app.wercker.com/status/a520b28caca342b4419caa09a8875607
[ebase-bldu]: https://app.wercker.com/project/bykey/a520b28caca342b4419caa09a8875607
[ebase-depi]: https://david-dm.org/screwdriver-cd/executor-base.svg?theme=shields.io
[ebase-depu]: https://david-dm.org/screwdriver-cd/executor-base

[k8s-veri]: https://img.shields.io/npm/v/screwdriver-executor-k8s.svg
[k8s-veru]: https://npmjs.org/package/screwdriver-executor-k8s
[k8s-bldi]: https://app.wercker.com/status/6eee5facca93cb34510bf36d814460e8
[k8s-bldu]: https://app.wercker.com/project/bykey/6eee5facca93cb34510bf36d814460e8
[k8s-depi]: https://david-dm.org/screwdriver-cd/executor-k8s.svg?theme=shields.io
[k8s-depu]: https://david-dm.org/screwdriver-cd/executor-k8s

[dbase-veri]: https://img.shields.io/npm/v/screwdriver-datastore-base.svg
[dbase-veru]: https://npmjs.org/package/screwdriver-datastore-base
[dbase-bldi]: https://app.wercker.com/status/fbf5553a4f8821567edc6394e976f4ab
[dbase-bldu]: https://app.wercker.com/project/bykey/fbf5553a4f8821567edc6394e976f4ab
[dbase-depi]: https://david-dm.org/screwdriver-cd/datastore-base.svg?theme=shields.io
[dbase-depu]: https://david-dm.org/screwdriver-cd/datastore-base

[imdb-veri]: https://img.shields.io/npm/v/screwdriver-datastore-imdb.svg
[imdb-veru]: https://npmjs.org/package/screwdriver-datastore-imdb
[imdb-bldi]: https://app.wercker.com/status/e4c32e69dde44ca5a62dc4b12355930c
[imdb-bldu]: https://app.wercker.com/project/bykey/e4c32e69dde44ca5a62dc4b12355930c
[imdb-depi]: https://david-dm.org/screwdriver-cd/datastore-imdb.svg?theme=shields.io
[imdb-depu]: https://david-dm.org/screwdriver-cd/datastore-imdb

[dydb-veri]: https://img.shields.io/npm/v/screwdriver-datastore-dynamodb.svg
[dydb-veru]: https://npmjs.org/package/screwdriver-datastore-dynamodb
[dydb-bldi]: https://app.wercker.com/status/bebcdc9de9d33dc7dea39e388efec0c0
[dydb-bldu]: https://app.wercker.com/project/bykey/bebcdc9de9d33dc7dea39e388efec0c0
[dydb-depi]: https://david-dm.org/screwdriver-cd/datastore-dynamodb.svg?theme=shields.io
[dydb-depu]: https://david-dm.org/screwdriver-cd/datastore-dynamodb

[cfg-veri]: https://img.shields.io/npm/v/screwdriver-config-parser.svg
[cfg-veru]: https://npmjs.org/package/screwdriver-config-parser
[cfg-bldi]: https://app.wercker.com/status/557eccbc3bebaca70f03b5093e3222f9
[cfg-bldu]: https://app.wercker.com/project/bykey/557eccbc3bebaca70f03b5093e3222f9
[cfg-depi]: https://david-dm.org/screwdriver-cd/config-parser.svg?theme=shields.io
[cfg-depu]: https://david-dm.org/screwdriver-cd/config-parser

[fuse-veri]: https://img.shields.io/npm/v/circuit-fuses.svg
[fuse-veru]: https://npmjs.org/package/circuit-fuses
[fuse-bldi]: https://app.wercker.com/status/7c8d2a125b557ea2ce44e1a88d2d481d
[fuse-bldu]: https://app.wercker.com/project/bykey/7c8d2a125b557ea2ce44e1a88d2d481d
[fuse-depi]: https://david-dm.org/screwdriver-cd/circuit-fuses.svg?theme=shields.io
[fuse-depu]: https://david-dm.org/screwdriver-cd/circuit-fuses

[keyb-veri]: https://img.shields.io/npm/v/keymbinatorial.svg
[keyb-veru]: https://npmjs.org/package/keymbinatorial
[keyb-bldi]: https://app.wercker.com/status/1393eaeadf0a2014e8c7c3dd83f58de2
[keyb-bldu]: https://app.wercker.com/project/bykey/1393eaeadf0a2014e8c7c3dd83f58de2
[keyb-depi]: https://david-dm.org/screwdriver-cd/keymbinatorial.svg?theme=shields.io
[keyb-depu]: https://david-dm.org/screwdriver-cd/keymbinatorial

[yo-veri]: https://img.shields.io/npm/v/generator-screwdriver.svg
[yo-veru]: https://npmjs.org/package/generator-screwdriver
[yo-bldi]: https://app.wercker.com/status/3471515bed0f8ad06b51b7db148627cf
[yo-bldu]: https://app.wercker.com/project/bykey/3471515bed0f8ad06b51b7db148627cf
[yo-depi]: https://david-dm.org/screwdriver-cd/generator-screwdriver.svg?theme=shields.io
[yo-depu]: https://david-dm.org/screwdriver-cd/generator-screwdriver

[lint-veri]: https://img.shields.io/npm/v/eslint-config-screwdriver.svg
[lint-veru]: https://npmjs.org/package/eslint-config-screwdriver
[lint-bldi]: https://app.wercker.com/status/76f9fccc5d63312b6c5a410650533fa0
[lint-bldu]: https://app.wercker.com/project/bykey/76f9fccc5d63312b6c5a410650533fa0
[lint-depi]: https://david-dm.org/screwdriver-cd/eslint-config-screwdriver.svg?theme=shields.io
[lint-depu]: https://david-dm.org/screwdriver-cd/eslint-config-screwdriver

[lnch-veri]: https://img.shields.io/github/tag/screwdriver-cd/launcher.svg
[lnch-veru]: https://github.com/screwdriver-cd/launcher/releases
[lnch-bldi]: https://app.wercker.com/status/822503b7af879d54018006aeafb317ae
[lnch-bldu]: https://app.wercker.com/project/bykey/822503b7af879d54018006aeafb317ae

[gitv-veri]: https://img.shields.io/github/tag/screwdriver-cd/gitversion.svg
[gitv-veru]: https://github.com/screwdriver-cd/gitversion/releases
[gitv-bldi]: https://app.wercker.com/status/28e7d21d5c6bfe687a26689ea48e53a7
[gitv-bldu]: https://app.wercker.com/project/bykey/28e7d21d5c6bfe687a26689ea48e53a7

[jobt-veri]: https://img.shields.io/github/tag/screwdriver-cd/job-tools.svg
[jobt-veru]: https://github.com/screwdriver-cd/job-tools/releases
