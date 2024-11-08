---
title: 分布式服务入门学习
date: 2024-10-11 18:39:07
path: /distributed-services-practice-learn/
tags: 后端, 系统设计, 读书笔记, 分布式
---

# 分布式系统、单体系统区别

分布式系统是对单体系统的一种改进，但这种改进同样也带来了复杂度和实现难度。

## 背景

单体系统是包含一个物理组件的系统，能够独立进行部署和运行。可以看到在单体系统内部可以采用分层的方式合理组织代码结构，但从物理上看就是一个能够独立运行的应用程序。

![](res/2024-10-11-17-35-01.png)

存在以下情况不能应对：

1. 业务复杂度和产品迭代速度
2. 处理高并发、大数据量的用户请求
3. 代码维护和团队协作

但是分布式系统引入了新问题

1. 网络传输的三态性
2. 数据的一致性
3. 可用性

## 技术体系

### 单体系统的核心问题

单体系统的核心问题表现在三个方面

1. 业务扩展性：任何业务的调整都需要发布整个系统，改一个地方就要重新构建、发布整个系统
2. 性能伸缩性：动态扩容对单体系统而言效率低下，如果通过简单扩容就能确保系统性能得到等比例提升，那么该系统就具备良好的伸缩性。对于单体系统来说，由于不同功能都在里面，即内存密集型和 CPU 密集型的代码都位于同一个服务器上，所以很难做到对资源的充分利用，如下图每个组件对资源利用率不同，无法针对组件级别进行资源利用率的提升

   ![](res/2024-10-11-18-18-37.png)

3. 代码复杂度：修改一处代码容易引发连锁问题，不同组件间边界模糊，由于代码复杂度导致的系统缺陷会触发很多连锁问题

### 分布式系统的本质特性

区别于单体系统，分布式系统会将整个系统拆分成多个能够独立运行的服务，这些服务在物理上是隔离的，相互之间基于网络进行通信和协调

下图展示的就是现实场景中常见的一种分布式系统，可以看到这里有专门针对业务处理的业务服务 1 和业务服务 2 这两个独立的服务，也存在 Web 服务、消息中间件、缓存等提供技术能力的独立组件

![](res/2024-10-11-18-24-39.png)

想要实现分布式系统，首要的就是完成对系统中各个服务的合理拆分。通常，我们有两种主流的拆分方式，即纵向（Vertical）拆分和横向（Horizontal）拆分

可以认为纵向拆分的目的就是更好地完成对系统中业务服务的合理组织。围绕一个完整而复杂的业务执行流程，我们通常可以根据不同的业务场景以及数据属性来完成对业务服务的拆分。例如，在常见的互联网医院系统中，具备最基本的医生、患者以及问诊等业务处理场景和数据，这时候我们就可以基于这些场景和数据来分别提取独立的业务服务，如下图所示

![](res/2024-10-11-18-25-54.png)

介绍完纵向拆分，我们再来看横向拆分。横向拆分的切入点在于复用，即我们在提取一系列独立服务的同时，还需要考虑通过一定的手段将它们高效地整合在一起。这样，整个系统就可以像是在搭积木一样对各个服务进行排列组合，如下图所示：

![](res/2024-10-11-18-27-12.png)

在上图中，我们注意到引入了一个分布式服务框架。通过该框架，系统中的医生服务、患者服务等一系列独立服务就可以进行合理地编排和整合，从而构建业务 A、业务 B 等不同的业务场景。显然，分布式服务框架在这里扮演了重要作用，而后续内容中所要介绍的 Dubbo 和 Spring Cloud 就是目前主流的分布式服务框架。

请注意，分布式系统相较于单体系统而言具备优势的同时，也存在一些我们不得不考虑的特性，包括以下

- 网络传输的三态性

   我们知道对于单体系统中的函数式方法调用而言，只有“成功”或“失败”这两种状态。但是分布式系统则不同，因为远程请求是通过网络进行传输的，而网络在处理请求时还会出现"超时"这个状态，这样就相当于有三个状态。

   显然，网络传输的三态性为系统开发带来新的挑战。面对超时状态，我们不能简单把它处理成是一种成功或失败，而是要具体场景具体分析，避免出现请求丢失或请求重复发送现象。在分布式系统设计过程中，我们需要考虑这种由于网络通信所导致的用户体验问题。

- 请求的容错性

   从错误发生的几率而言，分布式系统显然比单体系统更加容易出错，因为系统的调用链路变得更长、更复杂。每个分布式服务自身可能会发生异常，而这种异常在整个调用链路上会进行扩散，最终可能导致整个系统都不可用。

   在分布式系统设计过程中，一大挑战就是需要确保部分服务的异常情况不会影响到整个系统的可用性。

- 系统的异构性

   分布式系统的异构性很好理解，原则上，每个服务都可以采用一套完全不同的技术体系来进行实现，只要它们对外暴露接口是统一的。但是，因为技术异构性的存在，会增加分布式系统的开发难度和维护成本。

- 数据的一致性

   在分布式系统中，各个服务通常都会构建属于自身的数据库，这样就会导致业务数据无法进行集中管理，也就无法通过传统的事务机制确保它们之间的一致性。如何实现数据的一致性是分布式系统构建过程的一大难点。

以上几点是分布式系统的基本特性，我们无法避免，只能想办法进行利用和管理，这就给我们设计和实现分布式系统提出了挑战。

## 解题要点

通过对单体系统的核心问题和分布式系统本质特性的分析，我们明确了一点，即从技术演进角度讲，分布式系统的诞生是单体系统发展的必然结果。因此，在回答这类问题时，对于技术演进的背景和需求的讨论是我们的第一点回答思路。这部分内容通常不用过多展开，我们可以结合日常开发场景，从业务需求和技术需求角度简要介绍即可。

针对该类问题的第二点解答思路在于充分利用逻辑性和对比性。从面试题的考查方式而言，这是一道典型的对比类面试题。因此，针对如何介绍两个不同事物之间的差异，我们需要采用一定的逻辑性。一种比较容易掌握的技巧是：先抛出一个应用场景，然后分别对两种事物的正反面进行展开讨论。举例来说，如果我们想要阐述扩展性这一应用场景，那么对于单体系统而言，因为没有合理的业务边界和拆分策略，扩展性就很难保证；而对于分布式系统而言，通过引入合理的纵向/横向拆分机制就可以很好地解决这一问题。

虽然这是一道概念类的面试题，但也不要忘记在回答过程中提及一定的实践内容。对于面试过程而言，不管是怎么样的面试题，面试官都希望从候选人身上看到相关的实践经验。因此，最后一个解题的要点，就是建议你可以从日常开发过程出发，基于分布式系统的拆分和集成、请求容错性的实现、数据一致性的不同应对策略等角度，谈谈自己对分布式系统构建的一些思考和总结，相信是很好的加分项。

## 总结

我们已经提到了分布式系统所具备的一组本质特性，也强调了我们需要对这些特性进行合理的应用和管理。为此，我们需要进一步梳理分布式系统开发过程中的技术组件。那么，实现分布式系统应该具备哪些核心技术组件呢？

# 实现分布式系统应该具备哪些核心技术组件？

## 背景

分布式服务是构建分布式系统的基础，可以认为，任何一个分布式系统都是有若干个独立的服务所构成，这些服务通过网络通信实现相互调用，从而完成复杂的业务处理流程。

![](res/2024-10-12-10-06-52.png)

虽然，上图看起来并不复杂，但想要实现一套高性能、高可用、高扩展的分布式服务体系绝非易事。在日常开发过程中，我们在设计和实现分布式系统时需要系统梳理构建分布式服务的各个技术组件。而在实际的面试过程中这也是非常常见的一个面试问题，考查了候选人对分布式服务相关技术概念以及对应实现方案的理解程度。

从面试角度讲，涉及分布式服务技术组件的知识体系非常广泛，所以可以认为这是一道发散型的面试题，面试官想要的并不是一个标准答案，而是看候选人对这一主题理解的深度和广度。针对面试不同岗位的候选者，面试官的要求是不一样的，判断的标准也或有所不同。

## 问题分析

相信只要你开发过分布式系统，基本上都能对构建分布式服务所需要的技术组件说出个一二三来，比方说网络通信、远程调用。你可能也会提到负载均衡、集群容错这些更为复杂的名词。事实上，分布式服务的技术组件之间是有一定的逻辑关系的，有些组件能够独立运行，而有些组件则是构建在另一些组件的基础之上。比较典型的例子就是：配置中心的运行往往需要注册中心的支持，而服务容错则依赖于负载均衡的实现。

另一方面，对于分布式服务而言，组件与组件之间的定位也有所区别。有些是必备组件，缺少了它们系统就无法运行。有些则是扩展性组件，比较典型的就是前面提到的配置中心，原则上我们不使用配置中心也照样可以构建分布式系统。而还有一些则是通用型组件，这些组件并不局限于只能用于构建分布式服务，例如动态代理组件。

在面试过程中，关于这道题的问法其实有很多种，常见的包括：

- 如果想实现一套远程过程调用机制，你会重点设计哪几个技术组件？
- 负载均衡机制是如何与集群容错机制整合在一起的？
- 想要实现服务容错，有哪些技术手段？
- 微服务架构中，配置中心是如何与注册中心进行交互的？
- 为什么在分布式系统中，处处是代理？
- 在分布式服务构建过程中，经常用到的架构模式有哪些？

这些问题虽然问法各异，但考查的都是候选人对分布式服务中核心组件的理解程度。通过这样的分析，我们发现这一问题的难点在于我们要回答的概念有很多，而这些概念却又比较零散。当我们面对这种发散型面试题时，应对的方式绝对不能发散。单纯做零散的概念性阐述，往往很难得到面试官的认可，因为面试官会觉得你是刚接触分布式服务，没有自己的思考和体系。

应对这一问题的基本思路是要具备完整的技术认知，然后能够用自己的语言对各个组件的组成结构和基本原理做一定的展开，这样的话这道题应对起来就会比较自如。

因此，接下来我们就一起系统梳理该问题背后的技术体系。

## 技术体系

在分布式服务的开发过程中，开发人员需要应用到一批技术组件。按照这些技术组件的不同定位，我们把它们分成三大类，即远程过程调用组件、微服务构建组件和通用技术组件，如下图所示：

![](res/2024-10-12-10-11-57.png)

接下来，我们将对上图中的每一个技术组件做展开，从而为本课程后续内容的学习打好基础。

### 远程过程调用组件

远程过程调用是分布式服务最基础的实现技术，开发人员需要从网络通信、远程调用、负载均衡、服务容错以及服务降级这五个维度来进行系统的理解。

1. 网络通信：网络通信是一切分布式操作的基础。当客户端和服务器端建立网络连接之后就可以相互发送消息。但围绕网络通信整个过程，事情并没有那么简单。我们需要考虑网络通信的性能、可靠性以及在通信过程中实现数据传输的方式，这就涉及到 IO 模型、可靠性设计以及序列化方式等一系列技术主题。
2. 远程调用：远程调用解决的问题是如何发布远程服务以及如何引用远程服务。一旦服务发布成功，就相当于构建了一个有效的网络连接，并通过启动监听端口来对外暴露服务访问的入口；而服务引用则是一个向目标监听端点发起请求并获取响应结果的执行过程，如下图所示：

   ![](res/2024-10-12-10-13-23.png)

   在服务调用过程中，远程调用本地化是基本要求，即远程调用过程的实现对于开发人员而言应该是透明的。同时，我们也需要考虑同步调用、异步调用以及同步转异步调用等一系列具体的调用实现策略。

3. 负载均衡：所谓负载均衡，简单讲就是将请求按照一定的策略分摊到多个服务实例上进行执行，基本结构如下图所示：

   ![](res/2024-10-12-10-14-04.png)

   负载均衡在实现上可以使用硬件、软件或者两者兼有。而针对软件负载均衡，也可以分成服务器端负载均衡和客户端负载均衡两大类。在分布式服务构建过程中，我们主要的讨论对象是基于软件的客户端负载均衡机制。例如，目前主流的微服务架构实现框架 Spring Cloud、Dubbo 等都内置了完整的客户端负载均衡模块。

   另一方面，负载均衡算法决定了对请求进行分发的效果。负载均衡算法有很多，可以分成静态和动态两个大类，它们之间的区别在于动态算法依赖于当前服务的运行时状态，这些状态信息通常包括服务过去一段时间的平均调用时延和所承接的连接数等。

4. 服务容错：在分布式环境中，服务访问出错了该怎么办？这就涉及到服务可靠性问题。服务可靠性是分布式服务构建过程中的一项关键要素，我们需要引入容错思想和机制。常见的服务容错技术包括集群容错、服务熔断（Circuit Breaker）和服务回退（Fallback）等。下图展示的是添加了服务容错机制的系统架构演进过程：

   ![](res/2024-10-12-10-14-41.png)

5. 服务降级：从概念上讲，任何一个服务都是可以分等级的。具体的服务分级方法因业务场景和需求而定。一旦我们实现了对服务的针对性分级，那么就可以对那些处于业务链路最外围、等级最低的服务开始执行降级。至于如何对服务进行分级，可以按照需求采取一定的策略，例如常见的三级分类策略，如下图所示：

![](res/2024-10-12-10-15-16.png)

在上图中，一级服务属于核心服务，需要确保高可用，不能执行降级操作；二级服务通常采用的是异步交互方式，容忍暂时的数据不一致性；而三级服务则可以按需对整个服务实行降级操作。

### 微服务构建组件

在远程过程调用组件的基础上，我们继续讨论微服务构建组件，包括注册中心、服务网关、配置中心、消息通信和链路跟踪。这些组件扩展了分布式技术能力，为构建大规模分布式系统提供了技术保障。

1. 注册中心：在分布式服务构建过程中，服务与服务之间通过远程调用完成业务链路的构建。而在服务调用之前，我们首先需要发现服务，即解决在分布式集群环境下如何找到目标服务实例这一问题。服务发现和调用构成了服务交互的基础，整体流程下图所示，其中实线部分代表服务调用流程，而虚线部分则包含了服务的注册（Registration）和发现（Discovery）过程。

   ![](res/2024-10-12-10-16-02.png)

   可以看到，图中的这三个服务都需要注册到注册中心以确保负载均衡器能够从注册中心获取各个服务的定义信息。

2. 服务网关：在分布式系统中，API 网关（Gateway）或服务网关（Service Gateway）的出现有其必然性。我们可以根据需要在服务提供者和消费者之间架设这层服务网关。在注册中心和负载均衡的基础上，添加了服务网关之后的系统架构如下图所示：

   ![](res/2024-10-12-10-16-32.png)

   当然，并不是所有的服务调用链路上都需要添加这层网关，我们也可以根据具体场景直接通过负载均衡器进行服务访问。在实际应用过程中，这种混合式的服务调用管理方式也是一种常见的做法。

3. 配置中心：面对不断增长的服务实例数量，传统的配置信息管理方式就显得无能为力。为此，在分布式服务构建过程中，一般都需要引入配置中心（Configuration Center）的设计思想和相关工具。下图展示了在前面各个组件的基础上添加配置中心之后的系统架构图，分布式系统中的各个服务都可能会依赖配置中心，从而完成配置信息的统一管理。

   ![](res/2024-10-12-10-17-34.png)

4. 消息通信：降低服务与服务之间的耦合度是分布式系统设计的一大目标，为此，我们可以引入事件驱动架构，基本组成如下图所示：

   ![](res/2024-10-12-10-18-20.png)

   基于事件驱动架构，每一个服务既可以作为事件的发布者也可以作为事件的消费者，或者两者兼之。而事件也可以在不同的服务之间进行传播，从而满足各种特定的应用场景。

5. 链路跟踪：服务之间的调用不可避免会出现各种问题，这时候就需要引入分布式链路跟踪体系来定位和解决这些问题。基于每一次分布式请求，我们都可以捕获该请求的一系列跟踪数据，下图展示了基于 TraceId 和 SpanId 所构建的一次服务调用的完整链路。

   ![](res/2024-10-12-10-21-32.png)

   服务调用链路跟踪是分布式系统的基础需求之一，业界关于分布式链路跟踪也有统一的规范以及代表性的实现框架。

### 通用技术组件

在分布式服务构建过程中，也需要引入一组通用型的技术组件，这些技术组件在多个场景中（不仅限于分布式系统）都能发挥作用。本课程梳理了五种通用技术组件，包括动态代理、应用缓存、资源管理、框架集成以及架构模式。这种技术组件有些关注于具体某一个技术实现要点，有些则关注于框架的应用以及架构设计的方法和实践。

1. 动态代理：在日常开发过程中，动态代理可以说是一种通用性非常高的实现机制，它是面向切面编程的基础，也在主流的分布式服务开源框架中得到了广泛的应用。通过代理机制，一个对象就可以在承接另一个对象功能的同时添加新的功能。相比直接在原有对象中嵌入代码，代理机制为我们提供了更为优雅的解决方案。
2. 应用缓存：对于分布式服务而言，缓存应用非常广泛，开发人员可以使用位于应用程序内部的本地缓存，也可以使用位于独立服务器上的分布式缓存。在日常开发中，缓存的应用通常都是分层级的，我们会综合使用多级缓存来提高目标对象访问的效率和性能。
3. 资源管理：相信你对线程池、数据库连接池等技术并不陌生。这里的池（Pool）是一种对资源的抽象方法，代表一组可以随时使用的资源，但这些资源的创建和释放过程则基于一定的管理策略。资源池的应用非常广泛，存在多种具体的池化组件。
4. 框架集成：这里所说的框架集成，指的是 Dubbo、MyBatis、Spring Cloud 等主流的分布式开发框架与 Spring 框架之间的集成。我们可以基于命名空间以及自定义 starter 等机制完成与 Spring 之间的有效集成。理解框架集成的实现过程有利于掌握主流的分布式服务框架的运行原理。
5. 架构模式：架构模式描述某一特定应用领域中系统组织和表现的惯用方式。对软件体系架构模式的研究和实践促进了对软件设计的重用。在分布式系统开发过程中，也大量应用了诸如微内核架构、管道-过滤器架构等架构模式，这些模式能够为开发人员提供具有高度扩展性的技术组件。

## 解题要点

通过对技术体系的系统分析，我们明白了构建一个分布式服务系统所需要的各个技术组件。这里涉及了一大批专用名词。但是，光列举这些名称就够了吗？答案显然是否定的。

我们在解释这些名词时需要做一些扩展，多提及技术组件的关联关系，从而确保回答过程具备较好的逻辑性。这是解答这个问题的第一点思路。例如，我们在介绍注册中心时，需要提到该组件与负载均衡之间的集成关系。

针对该问题的第二点解答思路在于回归现实中的实践。本讲中介绍的技术组件都是很常见和很通用的，一般的分布式系统构建过程中都会使用到。你完全可以基于自己在日常开发过程中的应用情况来对这些组件做一定的展开。因为这是一道偏概念阐述的问题，所以如果能够做到理论联系实际，相信肯定能为你加分不少。

最后，我想强调的第三点是技术判断力，你需要对各个技术组件背后的实现复杂度有一定的认识。对于那些复杂度较高的技术组件，可以更为细化地进行阐述，并在一定程度上显现出自己所具备的设计思想和对实现原理的理解能力，这样就能达到一定的深度。

## 总结

分布式服务的相关组件虽然比较多，但并不难梳理和串联。正如我们在前面所讨论到的，很多技术组件的出现是必然的，而有些组件之间具备一定的相互关联关系。在本讲内容中，我们从远程调用、微服务以及通用技术组件这三大维度出发来对这些组件进行了分类，并针对每个类别梳理了五大技术组件，以帮助你能够更好地理解和把握，从而形成自己的知识体系。

在掌握了构建分布式服务的技术组件之后，下一讲我们将介绍基于这些组件所构建的分布式服务框架。实际上在本讲内容中，我们已经提到了 Dubbo、Spring Cloud 等框架，目前这些框架都非常主流。那么，这些框架都具备什么样的功能特性呢？

# 网络通信：如何完成客户端和服务端之间的高效通信？

从本讲开始，我们将进入到远程过程调用类技术组件的讨论，首先要讨论的是网络通信。

分布式系统的构建依赖网络通信。相比单块系统的函数式调用，分布式环境下的请求和响应过程涉及到客户端和服务器端之间跨网络的交互和协作。这个过程一方面要考虑到网络的三态性，另一方面也需要考虑资源的利用效率。

那么，如何设计并实现高效的网络通信机制？这是分布式服务框架的核心功能之一，也是我们在面试过程中经常会碰到的一个面试题。本讲内容将围绕这一问题展开讨论。

## 背景

在日常开发过程中，每一次分布式请求都会涉及到网络通信。网络通信表现为一个复杂且不可控的过程。然而，因为像 Dubbo、Spring Cloud 等主流的分布式服务框架都已经帮我们封装了网络通信过程，使得远程过程调用就像是在使用本地方法调用一样，导致了开发人员对网络通信过程的底层设计思想和实现原理往往不甚了解。

另一方面，对于分布式服务构建过程而言，网络通信是一个基础性、通用性的技术主题，涉及广泛的技术体系，既有深度又有广度，非常适合考查候选人的知识面。因此。网络通信在面试过程中出现的频率可以说非常高。作为面试官，我也经常会对候选人提出关于该主题的一些问题。

从面试角度讲，关于网络通信有很多种具体的问法，有些侧重于具体某一个知识点，有些则关注整个通信流程。当然，因为日常开发中大家都是使用一些开源框架来开发分布式系统，因此关于开源框架中网络通信具体实现过程和底层原理也是常见的考查方式。

这里我梳理了比较有代表性的一些面试话题，如下所示：

- 网络的长连接和短连接分别指什么？它们分别有什么特点和优势？
- 常见网络 IO 模型有哪些？各有什么功能特性？
- 如果确保网络通信过程的可靠性？
- 你认为网络通信包含的核心技术组件有哪些？
- 如果让你来设计网络传输协议，你有什么样的一些思考？
- 你能描述 Dubbo 框架中客户端和服务器端的网络通信实现过程吗？
- Dubbo 框架对网络通信过程采用了什么样的分层设计思想？

## 分析

网络通信的实现方式实际上有很多种，但因为网络通信过程复杂且不可控，因此如何使这个过程的代价降到用户可以接受的层次是分布式系统设计的重要目标。

我们知道客户端和服务器端之间需要完成跨网络的交互过程，也就意味着两者之间需要建立网络连接。网络连接的创建和维护方式决定了通信过程的效率。同时，我们知道任何网络请求的处理过程都涉及到 IO 操作，而不同类似的 IO 操作方式对性能的影响巨大。在网络通信过程中，我们需要选择合适的 IO 模型。

关于网络通信，可靠性是一个不得不提的话题。网络状态是不稳定的，网络之间的通信过程必须在发生问题时能够快速感知并修复。

我们把上述分析点整理成一张图，如下所示：

![](res/2024-10-13-23-49-00.png)

上图构成了我们回答这类面试题的基本思路。

## 技术体系

在本节内容中，让我们来对上图中所展示的各项技术体系展开讨论。

### 网络连接

关于网络连接，我们要讨论的主要是长连接和短连接的概念。当客户端在向服务端发送请求并获取响应结果之后，这两种连接方式的区别在于对连接本身的处理方式。

所谓短连接，是指一旦请求响应过程结束，连接自动关闭。而长连接则不同，客户端可以利用这个连接持续地发送请求并获取响应结果。显然，采用何种连接方式没有统一的标准，而是要看具体的应用场景。有时候，考虑到性能和服务治理等因素，我们也会把短连接和长连接组合起来使用。

### IO 模型

任何网络请求处理过程都涉及到 IO 操作。

最基本的 IO 操作模型就是阻塞式 IO（Blocking IO，BIO），该模型要求服务器端针对每次客户端请求都生成一个处理线程，因此对服务器端的资源消耗要求很高。

非阻塞 IO（Non-Blocking IO，NIO）和 IO 复用（IO Multiplexing）技术实际上也会在 IO 上形成阻塞，真正在 IO 上没有形成阻塞的是异步 IO（Asynchronous，AIO）。

各个 IO 模型效果如下图所示：

![](res/2024-10-13-23-50-30.png)

### 可靠性

因为网络状态是不稳定的，所以业界诞生了一系列手段来确保网络通信的可靠性。

首先，我们需要对网络的通信链路进行有效性的检测，这方面最常见的实现机制就是心跳检测。我们可以在网络协议的 TCP 层发送心跳包，也可以在应用层协议上传递包含一定业务数据的心跳信息。

另一方面，一旦检测到网络通信出现问题，那么就需要采取一定措施来恢复网络状态。这方面主流的做法就是断线重连。针对不同场景，我们可以采用不同的重连次数和频率，直到网络重连成功或者超时。

讲到这里，我们需要注意，上述关于网络通信相关技术体系的讨论都是相对抽象的内容。在具体面试过程中，如果只是简单给出这些概念性的描述，显然无法满足面试官的要求。要想充分展示候选人对网络通信的掌握程度，就需要依托一定的开源框架。只有通过这些开源框架，我们才能了解网络通信的底层原理。

在接下来的内容中，我们将基于目前主流的分布式服务框架 Dubbo 来分析该框架针对网络通信采用了什么样的设计思想和实现过程。

## 源码解析

在 Dubbo 框架中，存在一个独立的 Remoting 模块，封装了对整个网络通信的实现过程，该模块的组成结构如下图所示：

![](res/2024-10-13-23-51-30.png)

从组成结构上讲，Remoting 模块主要包含三个组件。

- Exchange 组件。信息交换层，用来封装请求-响应过程。
- Transport 组件。网络传输层，基于 Netty 等框架抽象统一的网络通信接口。
- Serialize 组件。序列化层，主要完成数据的序列化和反序列化过程。

而从技术分层上讲，Remoting 模块处于整个 Dubbo 框架的底层，是我们后续要介绍的服务发布和服务消费的基础。显然，Remoting 模块的组件呈现的是一种对称结构，即 Dubbo 的生产者和消费者都依赖于底层的网络通信。所以，我们也将分别从服务器端和客户端两个角度出发分析 Dubbo 中具体的网络通信过程。

然后，在 Dubbo 中，真正实现网络通信的过程委托给了第三方组件。Dubbo 通过 SPI 的方式提供了与 Netty、Mina 等多种通信框架的集成方式。这部分内容相当于是对上图中 Remoting 模块的补充，从层次上讲应该属于 Dubbo 框架的最底层。

### Dubbo 服务器端通信原理

我们首先介绍 Dubbo 服务器端的网络通信过程。请记住，Dubbo 中服务器端通信的目的就是集成并绑定 Netty 服务从而启动服务监听。我们关注 Exchange 信息交换层和 Transport 网络传输层这两个核心层之间的交互和协作过程，如下图所示：

![](res/2024-10-13-23-52-48.png)

上图中涉及了 ExchangeServer、HeaderExchange、NettyTransport 和 NettyServer 等一系列核心对象。显然，通过这些对象从命名上就可以很明确地将它们划分到 Exchange 和 Transport 这两个层。

在 Dubbo 中存在一个 Protocol 接口，该接口是 Dubbo 中最基本的远程过程调用实现接口，完成了服务的发布和调用功能。而在 Protocol 接口中存在 export 和 refer 这两个核心方法，其中前者用于对外暴露服务，后者则用来对远程服务进行引用。针对 Protocol 接口，Dubbo 提供了一组实现类，其中最重要的就是 DubboProtocol。

我们从 DubboProtocol 中的 export 方法进行切入，该方法会根据传入的 URL 对象创建一个 Exchange 服务器，如下所示：

```java
private void openServer(URL url) {
        String key = url.getAddress();
        boolean isServer = url.getParameter(Constants.IS_SERVER_KEY, true);
        if (isServer) {
            ExchangeServer server = serverMap.get(key);
            if (server == null) {
                serverMap.put(key, createServer(url));
            } else {
                server.reset(url);
            }
        }
}
```

我们来看 Exchange 服务器的创建过程，对应的 createServer 方法如下所示：

```java
private ExchangeServer createServer(URL url) {
        // 省略其他代码
        ExchangeServer server;
        try {
            server = Exchangers.bind(url, requestHandler);
        }
        return server;
}
```

可以看到这里的关键代码就是通过 Exchangers 的 bind 方法创建了 ExchangeServer，这个过程依赖于一个 Exchanger 接口。那么这个 Exchanger 接口是做什么用的呢？该接口定义如下所示：

```java
@SPI(HeaderExchanger.NAME)
public interface Exchanger {
    @Adaptive({Constants.EXCHANGER_KEY})
    ExchangeServer bind(URL url, ExchangeHandler handler) throws RemotingException;

    @Adaptive({Constants.EXCHANGER_KEY})
    ExchangeClient connect(URL url, ExchangeHandler handler) throws RemotingException;
}
```

Exchanger 接口只有两个方法，一个是面向服务器端的 bind 方法，一个是面向客户端的 connect 方法。在 Dubbo 中，Exchanger 的实现类只有一个，即 HeaderExchanger，如下所示：

```java
public class HeaderExchanger implements Exchanger {
    public static final String NAME = "header";

    public ExchangeClient connect(URL url, ExchangeHandler handler) throws RemotingException {
        return new HeaderExchangeClient(Transporters.connect(url, new DecodeHandler(new HeaderExchangeHandler(handler))), true);
    }

    public ExchangeServer bind(URL url, ExchangeHandler handler) throws RemotingException {
        return new HeaderExchangeServer(Transporters.bind(url, new DecodeHandler(new HeaderExchangeHandler(handler))));
    }
}
```

请注意，上述 HeaderExchanger 在创建 HeaderExchangeServer 的同时也加入心跳检测功能，如下所示：

```java
private void startHeatbeatTimer() {
        stopHeartbeatTimer();
        if (heartbeat > 0) {
            heatbeatTimer = scheduled.scheduleWithFixedDelay(
                    new HeartBeatTask(new HeartBeatTask.ChannelProvider() {
                        public Collection<Channel> getChannels() {
                            return Collections.unmodifiableCollection(
                                    HeaderExchangeServer.this.getChannels());
                        }
                    }, heartbeat, heartbeatTimeout),
                    heartbeat, heartbeat, TimeUnit.MILLISECONDS);
        }
}
```

在 HeartBeatTask 的 run 方法中，我们根据所配置的 heartbeat、heartbeatTimeout 等相关心跳属性，执行 channel.reconnect、channel.close 等方法。这也是心跳检测机制的一种常见实现方式。

注意到，我们在 HeaderExchangeServer 中终于看到了属于 Transport 层的对象 Transporters，接下来我们来看服务器端 Transport 相关的组件。

站在服务器的角度，网络通信过程的目的只有一个，就是装配服务并启动监听，从而接收来自服务消费者的访问。而对于服务消费者而言，通信过程的目的无非是对远程服务进行连接、发送请求并获取响应。因此，在 Dubbo 中存在一个 Transporter 接口，该接口提供了 bind 和 connect 方法分别对这两个基本操作进行封装，如下所示：

```java
@SPI("netty")
public interface Transporter {
    @Adaptive({Constants.SERVER_KEY, Constants.TRANSPORTER_KEY})
    Server bind(URL url, ChannelHandler handler) throws RemotingException;

    @Adaptive({Constants.CLIENT_KEY, Constants.TRANSPORTER_KEY})
    Client connect(URL url, ChannelHandler handler) throws RemotingException;
}
```

我们发现 Transporter 接口的定义与 Exchanger 接口非常类似，两者同时提供了 bind 和 connect 这两个方法。区别在于 Exchanger 中用到的 ExchangeHandler，而 Transporter 中用到的是 ChannelHandler，显然 ChannelHandler 面向消息通信的通道，提供了比 ExchangeHandler 更底层的操作语义。

与 HeaderExchanger 不同，Dubbo 中针对 Transporter 接口提供了一批实现类，包括 GrizzlyTransporter、MinaTransporter 以及两个 NettyTransporter。系统默认会加载 org.apache.dubbo.remoting.transport.netty 包下的 NettyTransporter，该类如下所示：

```java
public class NettyTransporter implements Transporter {
    public static final String NAME = "netty4";

    public Server bind(URL url, ChannelHandler listener) throws RemotingException {
        return new NettyServer(url, listener);
    }

    public Client connect(URL url, ChannelHandler listener) throws RemotingException {
        return new NettyClient(url, listener);
    }
}
```

这里看到了真正实现网络通信的 NettyServer 类，NettyServer 实现了 Server 接口并扩展了 AbstractServer 类。在 AbstractServer 中，Dubbo 提供了对网络服务端的通用抽象，即抽象出 open、close、send 等一组面向网络通信的通用方法。而 NettyServer 作为 AbstractServer 的子类，它的启动监听实现代码如下所示：

```java
protected void doOpen() throws Throwable {
        ...
        bootstrap = new ServerBootstrap(channelFactory);

        final NettyHandler nettyHandler = new NettyHandler(getUrl(), this);
        channels = nettyHandler.getChannels();
        bootstrap.setOption("child.tcpNoDelay", true);
        bootstrap.setPipelineFactory(new ChannelPipelineFactory() {
            public ChannelPipeline getPipeline() {
                NettyCodecAdapter adapter = new NettyCodecAdapter(getCodec(), getUrl(), NettyServer.this);
                ChannelPipeline pipeline = Channels.pipeline();
                pipeline.addLast("decoder", adapter.getDecoder());
                pipeline.addLast("encoder", adapter.getEncoder());
                pipeline.addLast("handler", nettyHandler);
                return pipeline;
            }
        });
        channel = bootstrap.bind(getBindAddress());
}
```

熟悉 Netty 框架的开发人员对上述代码一定不会陌生，这里使用 Netty 的 ServerBootstrap 完成服务启动监听，同时构建了 NettyHandler 作为其网络事件的处理器。然后 NettyServer 的 doClose 方法基于 Netty 的 boostrap 和 channel 对象完成了网络资源释放。

这样我们对 Dubbo 中与网络通信相关的服务监听启动和关闭，以及发送消息的过程就有了整体的了解。

### Dubbo 客户端通信原理

有了对前面服务器端各个技术组件的介绍，理解 Dubbo 客户端通信原理就会容易很多。我们在介绍服务器端时所引入的 Transporter 接口同时包含了对客户端方法的定义，而 Transporter 的实现类 NettyTransporter 也同时提供了 NettyClient 类，如下所示：

```java
public class NettyTransporter implements Transporter {
    public static final String NAME = "netty";

    public Server bind(URL url, ChannelHandler listener) throws RemotingException {
        return new NettyServer(url, listener);
    }

    public Client connect(URL url, ChannelHandler listener) throws RemotingException {
        return new NettyClient(url, listener);
    }
}
```

与 NettyTransporter 相关的这些核心类之间的关系下图所示：

![](res/2024-10-13-23-56-50.png)

上图中的很多类我们都已经明确了，因此在介绍 Dubbo 的客户端通信原理时，不会像服务端那样做全面展开，而是更多关注于客户端本身的特性，所以我们的思路先从底层的 NettyClient 类进行切入。

与 NettyServer 类类似，NettyClient 也存在一个抽象的父类 AbstractClient。作为网络客户端的通用抽象，AbstractClient 这个模板类一共提供了 doOpen、doConnect、doDisconnect、doClose、getChannel 这 5 个模板方法。与服务器端所提供的 3 个方法相比，客户端还需要实现与 Connect 这一操作相关的两个方法。

NettyClient 中的 doOpen 方法如下所示，这里创建了 ClientBootstrap 并完成初始化参数设置。

```java
@Override
protected void doOpen() throws Throwable {
        ...
        bootstrap = new ClientBootstrap(channelFactory);
        final NettyHandler nettyHandler = new NettyHandler(getUrl(), this);
        bootstrap.setPipelineFactory(new ChannelPipelineFactory() {
            public ChannelPipeline getPipeline() {
                NettyCodecAdapter adapter = new NettyCodecAdapter(getCodec(), getUrl(), NettyClient.this);
                ChannelPipeline pipeline = Channels.pipeline();
                pipeline.addLast("decoder", adapter.getDecoder());
                pipeline.addLast("encoder", adapter.getEncoder());
                pipeline.addLast("handler", nettyHandler);
                return pipeline;
            }
        });
}
```

和 NettyServer 一样，NettyClient 同样完成了对 Netty 框架的封装。在 NettyClient 的 doConnect 方法中，同样使用 ClientBootstrap 完成与服务端的连接和事件监听。而 doDisconnect 方法则用于移除当前已经断开连接的 Channel。然后，和 HeaderExchangeServer 类类似，在 HeaderExchangeClient 类中也添加了定时心跳收发及心跳超时监测机制。

## 解题要点

对于远程过程调用而言，网络通信还是一个偏向于概念的技术考点。因此，在回答这类问题时，第一步需要针对网络通信这个话题本身给出一些说明和描述，这属于理论知识体系，是需要死记硬背的基础内容。基于对这一话题的了解，通常我们就可以引出一些自己比较熟悉的点，围绕这些点来进行展开和引导即可。例如，对于网络传输协议，如果你了解 ISO/OSI 模型，那就可以基于这个模型来对类似“消息头”这种自己比较熟悉的点进行发散。

第二个解题要点是对网络通信实现过程进行抽象化、系统化的阐述。在目前主流的分布式服务框架中，对于网络通信模块都会有自己的一些抽象和提炼，其内部结构往往比较复杂。以本讲中介绍的 Dubbo 框架为例，就采用了明确的分层架构。每一层中都包含了一些核心的接口，这些接口之间的继承关系以及所处于的层次如下图所示：

![](res/2024-10-13-23-58-54.png)

针对网络通信，我们要明确 Dubbo 框架集成了很多第三方工具，这部分工具只关注于底层的具体网络通信过程。Dubbo 把这一过程抽象成一个 Transport 层，即网络传输层。而 Dubbo 又提供了一个 Exchange 层，用于封装请求和响应，称为信息交换层。从功能职责上讲，Exchange 偏向于 Dubbo 对自身通信过程的抽象和封装，跟具体的网络通信关系不大，具体的网络传输工作都是由 Transport 层负责完成。理解 Dubbo 框架的这种设计思想和实现方式，一方面有助于提升面试内容的丰富程度，另一方面对于更好地理解框架实现原理也很有帮助。

在面试过程中，我们需要确保整个针对网络通信的分析过程是理论结合实践的，如果你能够把本讲内容结合起来进行讲解，相信这道面试题会成为你区别于其他候选人的一个亮点。

## 小结与预告

本讲介绍了分布式系统远程过程调用部分的第一个技术组件，即网络通信。可以说网络通信是一切分布式系统的基础，我们从网络连接、IO 模型等角度讨论了与网络通信相关的一些基本概念。

本讲的核心内容是对 Dubbo 中网络通信具体实现过程的深入分析，我们从源码级别对框架中的核心类进行了展开，并明确了 Dubbo 框架在实现网络通信模块时所采用的分层架构。Dubbo 在这一维度上的分层架构为我们如何合理规划底层模块的职责和边界提供了很好的参考价值。Dubbo 中关于服务器端和客户端通信的实现过程还是比较复杂的，涉及到更底层的 Channel 等相关的操作，大家可以自己通过阅读源码进行理解。

在本讲内容中，我们还留着一个伏笔，那就是序列化。任何一次网络请求过程都涉及到对数据的序列化操作。而序列化的具体实现工具很多，但这些工具背后实际上还是有一些通用的功能特性值得进行分析和总结，从而方便我们做出技术选型。下一讲我们将针对这个话题展开详细讨论。

# 序列化：如何对序列化实现工具进行正确选型？

在上一讲中，我们对远程过程调用中客户端与服务器端的网络通信过程进行了详细的讨论。借助于分布式服务框架，我们可以实现不同服务之间跨网络的交互和协作。网络通信涉及到数据的有效传输，这就需要引入另一个技术组件，即序列化。而目前关于如何实现序列化和反序列化，业界也诞生了一大批工具和框架。

那么，序列化是一种什么样的技术组件？我们又应该如何对种类繁多的序列化实现工具进行正确选型呢？这是面试官经常会抛出的一个面试话题。本讲内容将围绕这一话题展开讨论。

## 问题背景

在现实中，我们通常会使用 Dubbo、Spring Cloud 等开源框架，以及 TCP、HTTP 等网络传输协议来发起远程调用。对于这些框架和协议而言，客户端发起请求的方式，以及服务端返回响应结果的处理过程都是不一样的。但是这里存在一个共同点，即无论采用何种开发框架和网络传输协议，都涉及到业务数据在网络中的传输，这就需要应用到序列化技术。和上一讲介绍到的网络通信不同，序列化技术是直接面向开发人员的，我们可以对具体的序列化工具和框架进行选择，而不像网络通信过程那样只能依靠框架底层所封装的能力。对于序列化技术而言，这种差异性导致了面试过程不仅仅只会考查对技术本身的了解程度，而是更多会讨论如何对序列化工具进行合理选择。

目前，序列化工具很多，据统计已经不下 100 种。在面试过程中显然无法对具体的实现工具进行一一罗列。因此，关于序列化技术的考查方式是比较灵活的，需要候选人有足够的知识面，了解目前业界主流的序列化技术。更为重要的，候选人还需要具备综合的抽象思维，能够将不同的工具按照一定的维度进行分类，从不同的功能特性角度出发进行分析。

从面试角度讲，关于序列化技术的常见考查方式包括：

- 你知道哪些序列化工具，它们各自有什么特性？
- 你在选择序列化工具时，重点会考虑哪些方面的要素？
- 为什么像 Protobuf、Thrift 这些序列化工具会采用中间语言技术？
- 如果只考虑性能，你会选择哪款序列化工具？
- Google 的 Protobuf 为什么会那么快？

可以看到，这些面试题既包括对序列化技术原理和实现方法的考查，也会涉及到具体某一个工具框架的细节。从我的面试经验而言，能够回答比较顺畅的候选人并不是很多，需要大家在平时的工作中不断积累。

## 问题分析

究竟什么是序列化？我们可以简单把它理解为是一种从内存对象到字节数据的转换过程。通过序列化，我们就可以把数据变成可以在网络上进行传输的一种媒介，如下图所示：

![](res/2024-10-16-11-52-42.png)

在上图中，我们注意到还有一个反序列化的概念。所谓反序列化，实际上就是序列化的逆向过程，把从网络上获取的字节数据再次转化为可以供内存使用的业务对象。

序列化的方式有很多，实现工具也非常丰富，常见的如下表所示：

| 序列化工具        | 简要描述                  |
| :---------------- | :------------------------ |
| Java Serializable | JDK 自带序列化工具        |
| Hessian           | Dubbo 框架默认序列化工具  |
| Protobuf          | gRPC 框架默认序列化工具   |
| Thrift            | Facebook 跨语言序列化工具 |
| Jackson           | Spring 框架默认序列化工具 |
| FastJson          | 阿里巴巴高性能序列化工具  |

上表罗列的也只是一些最主流的序列化工具，其他可供开发人员使用的工具和框架还有很多。虽然这些工具的定位和作用是类似的，但所具备的特性却不尽相同。这就涉及到日常开发过程中开发人员经常要面对的一个问题，即技术选型问题。

关于技术选型，我们的思路首先是确定所需要考虑的技术维度。在序列化领域，我们可以抽象出三个技术维度。

- 功能：包括支持的序列化数据表现形式、数据结构等。
- 性能：包括空间复杂度和时间复杂度等。
- 兼容性：包括版本号机制等。

基于上述三个技术维度，我们回答这类面试题的思路就有了。而从这三个技术维度的描述出发，我们也不难看出每一个技术维度还可以继续进行细分，接下来，让我们来对具体的技术体系展开讨论。

## 技术体系

序列化工具和框架各有特色，但它们所采用的数据表现形式一般分成两大类，即具备可读性的文本类，以及不具备可读性的二进制类。对于前者，代表性的框架有 Jackson 和 FastJson，它们都采用了 JSON 作为数据表现形式。而后者则包括 Protobuf、Thrift 等。开发人员往往对序列化工具的数据表现形式比较在意，因为这直接决定了我们是否可以直接人为对数据的正确性进行判断。显然，数据的表现形式是序列化工具的一大功能特性，但并不是最重要的功能特性。接下来，就让我们先从序列化的核心功能开始展开讨论。

### 序列化的功能

在选择序列化工具时，功能完整度是我们首先要考虑的一个技术维度，具体的关注点包括：

- 数据结构的丰富程度；
- 开发的友好性；
- 对异构平台的支持性。

我们首先来看数据结构，这方面的功能差异性主要体现在是否对一些复杂数据结构的支持。常见的复杂数据结构包括泛型结构以及 Map/List 等集合结构。我们来看如下所示的一个具体的示例：

```java
public class User {
    public int id;
    public String username;
    public List<Link> links;
    public Map result;
}

public class Link {
    public String name;
    public String phone;
}
```

可以看到，这里定义了一个 User 对象，而这个 User 对象中又分别包含了一个 List 结构和一个 Map 结构，其中 List 结构所指向的还是一组自定义对象 Link。针对这种复杂数据结构，如果我们使用 FastJson 来进行序列化，那么如下所示的代码是可以正常运作的。

```java
User user = new User();
// 省略对 user 对象进行赋值
// 将对象转化为 JSON 字符串
String str = JSON.toJSONString(user);
// 将 JSON 字符串转成对象
User myuser = JSON.parseObject(str, User.class);
```

而如果我们使用 Protobuf，那么这种复杂数据结构是无法支持的。如果想要使用 Protobuf，需要对这个数据结构进行调整，将 List 换成更为通用的数据结构。另一方面，针对 Protobuf 框架，我们也可以引出下一个我们要讨论的功能点，即开发的友好性。

开发友好性用来衡量工具本身对于开发人员实现序列化的开发难易程度。就像前面示例所展示的，我们在使用 FastJson 时，通过几行代码就能实现对象的序列化和反序列化。而有些工具则不一定，以 Protobuf 为例，在使用该工具时，我们首先要做的是定义一种中间语言，示例如下：

```protobuf
syntax = "proto3";

message Student
{
    int32 id= 1;
    string name = 2;
    int32 sex = 3;
    string hobby = 4;
    string skill = 5;
}
```

这里的 `syntax="proto3"` 表示运用 proto3 版本的语法，而 message 类似于 Java 中的 Class。在开发过程中，我们需要将这段中间语言保存为一个 student.proto 文件，然后再通过 Protobuf 的 protoc 命令将它转化为 Java 文件才能使用，如下所示：

```bash
protoc --java_out=. student.proto
```

可以看到，中间语言所带来的开发复杂度是显而易见的。使用中间语言的典型工具还包括 Thrift，它需要事先提供一个 .thrift 文件。

讲到这里，你可能会问，为什么 Protobuf 和 Thrift 要使用中间语言呢？原因就在于它们基于中间语言提供了一项重要的技术特性，即跨语言的异构性。

异构性的需求来自分布式系统中技术架构和实现方式的多样性。原则上，每个服务都可以基于不同的技术体系进行实现，这些技术体系所采用的开发语言可能都是不一样的，这时候就需要引入支持多语言的序列化工具，如下图所示：

![](res/2024-10-16-11-57-19.png)

实际上，很多场景下我们之所以不选择 JDK 自带的序列化机制，很重要的一个原因就在于它只能支持 Java 语言。而基于 Protobuf 等工具所提供的中间语言机制，我们可以生成面向不同语言的序列化数据，包括 C++、JAVA、Python、Objective C、C#、Ruby、PHP、JavaScript 等，我们也可以找到几乎涵盖所有其他语言的第三方拓展包。

另一方面，无论是数据结构的丰富程度，还是开发友好性，这些功能特性与跨语言支持之间往往是存在一定矛盾的。举个例子，要想支持多语言，那么就必须采用那些非常通用的数据结构，确保所有语言都内置了对这些数据结构的支持。这样的话，诸如前面提到的 Map/List 等复杂数据结构显然就不合适了。

### 序列化的性能

在日常开发过程中，我们在选择序列化工具时往往会把性能作为一项重要的指标进行考虑。对于序列化的性能而言，我们关注两个指标，即：

- 时间复杂度：表示序列化/反序列化执行过程的速度。
- 空间复杂度：表示序列化数据所占有的字节大小。

对于日常开发过程中经常使用的一些序列化工具，我们可以列举了它们在性能上的一些量化数据，如下表所示：

|          | 时间复杂度（序列化） | 时间复杂度（反序列化） | 空间复杂度 |
| :------- | :------------------- | :--------------------- | :--------- |
| Java     | 8654                 | 43787                  | 889        |
| Hessian  | 6725                 | 10460                  | 501        |
| Protobuf | 2964                 | 1745                   | 239        |
| Thrift   | 3177                 | 1949                   | 349        |
| Jackson  | 3052                 | 4161                   | 503        |
| Fastjson | 2595                 | 1472                   | 468        |

通过对比，我们注意到在时间复杂度上可以优先选择阿里巴巴的 FastJson，而在空间复杂度上 Google 的 Protobuf 则具备较大的优势。

### 序列化的兼容性

关于序列化技术最后需要讨论的一个话题是兼容性。

我们知道随着业务系统的不断演进，服务中所定义的接口以及数据结构也不可避免会发生变化。通常，在分布式服务开发过程中，我们会引入版本概念来应对接口和数据结构的调整。在序列化工具中，我们同样需要考虑版本。这方面比较典型的例子就是 JDK 自带的序列化版本 Id。一旦我们在类定义中实现了 Serializable 接口，JDK 就提示你需要指定一个序列化版本 Id，如下所示：

```java
public class MyObject implements Serializable {
    // 唯一的序列化版本号
    private static final long serialVersionUID = -1127800498182345096L;
}
```

基于这种显式的版本号机制，在序列化时，如果对象之间的版本 Id 不一致，那么 JVM 就会抛出一个 InvalidCastException 的异常；反之则可以正常进行转换。

有些序列化工具虽然没有明确指定版本号的概念，但也能实现前向兼容性，比较典型的就是 Protobuf。

## 源码解析

介绍完序列化的相关技术体系，让我们再次回到具体的分布式开源框架，来看看业界主流的框架是如何实现序列化过程的。这里还是以阿里巴巴的 Dubbo 框架为例展开讨论。

在上一讲中，我们介绍了 Dubbo 框架中的 Remoting 模块。作为回顾，我们给出该模块的组成结构图，如下图所示：

![](res/2024-10-16-14-34-22.png)

可以看到，在 Remoting 模块中还剩下一个 Serialize 组件没有介绍，从命名上我们不难看出该组件与序列化相关。事实上，Dubbo 提供了 Serialization 接口（位于 dubbo-common 代码工程中）作为对序列化的抽象。而对应的序列化和反序列化操作的返回值分别是 ObjectOutput 和 ObjectInput，其中 ObjectInput 扩展自 DataInput，用于读取对象；而 ObjectOutput 扩展自 DataOutput，用于写入对象，这两个接口的定义如下所示：

```java
public interface ObjectInput extends DataInput {
    Object readObject() throws IOException, ClassNotFoundException;
    <T> T readObject(Class<T> cls) throws IOException, ClassNotFoundException;
    <T> T readObject(Class<T> cls, Type type) throws IOException, ClassNotFoundException;
}

public interface ObjectOutput extends DataOutput {
    void writeObject(Object obj) throws IOException;
}
```

在 Serialization 接口的定义上，可以看到 Dubbo 中默认使用的序列化实现方案基于 hessian2。Hessian 是一款优秀的序列化工具。在功能上，它支持基于二级制的数据表示形式，从而能够提供跨语言支持；在性能上，无论时间复杂度还是空间复杂度也比 Java 序列化高效很多，如下图所示：

![](res/2024-10-16-14-35-05.png)

在 Dubbo 中，Hessian2Serialization 类实现了 Serialization 接口，我们就以该类为例介绍 Dubbo 中具体的序列化/反序列化实现方法。Hessian2Serialization 类定义如下所示：

```java
public class Hessian2Serialization implements Serialization {
    public static final byte ID = 2;
    public byte getContentTypeId() {
        return ID;
    }

    public String getContentType() {
        return "x-application/hessian2";
    }

    public ObjectOutput serialize(URL url, OutputStream out) throws IOException {
        return new Hessian2ObjectOutput(out);
    }

    public ObjectInput deserialize(URL url, InputStream is) throws IOException {
        return new Hessian2ObjectInput(is);
    }
}
```

Hessian2Serialization 中的 serialize 和 deserialize 方法分别创建了 Hessian2ObjectOutput 和 Hessian2ObjectInput 类。以 Hessian2ObjectInput 为例，该类使用 Hessian2Input 完成具体的反序列化操作，如下所示：

```java
public class Hessian2ObjectInput implements ObjectInput {
    private final Hessian2Input mH2i;

    public Hessian2ObjectInput(InputStream is) {
        mH2i = new Hessian2Input(is);
        mH2i.setSerializerFactory(Hessian2SerializerFactory.SERIALIZER_FACTORY);
    }

    // 省略各种读取具体数据类型的工具方法

    public Object readObject() throws IOException {
        return mH2i.readObject();
    }

    public <T> T readObject(Class<T> cls) throws IOException,
            ClassNotFoundException {
        return (T) mH2i.readObject(cls);
    }

    public <T> T readObject(Class<T> cls, Type type) throws IOException, ClassNotFoundException {
        return readObject(cls);
    }
}
```

Hessian2Input 是 Hessian2 的实现库 com.caucho.hessian 中的工具类，初始化时需要设置一个 SerializerFactory，所以我们在这里还看到存在一个 Hessian2SerializerFactory 工厂类，专门用于设置 SerializerFactory。而在 Hessian2ObjectInput 中，各种以 read 为前缀的方法实际上都是对 Hessian2Input 中相应方法的封装。

用于执行反序列化的 Hessian2ObjectOutput 与 Hessian2ObjectInput 类也比较简单，这里不再展开。

关于 Dubbo 序列化的另一条代码支线是 Codec2 接口，该接口位于 dubbo-remoting-api 代码工程中，提供了对网络编解码的抽象，而编解码过程显然需要依赖 Serialization 接口作为其数据序列化的手段。我们可以通过如下所示的代码片段来回顾这一点，这段代码来自 DubboCodec 中的 decodeBody 方法。

```java
public class DubboCodec extends ExchangeCodec implements Codec2 {

    protected Object decodeBody(Channel channel, InputStream is, byte[] header) throws IOException {
        // 获取序列化对象
        Serialization s = CodecSupport.getSerialization(channel.getUrl(), proto);
    }
}
```

那么，这里的 Codec 和 Serialization 如何与上一讲中介绍的 Exchange 和 Transport 结合起来构成一个完整的链路呢？我们可以明确一点，序列化和编解码过程在网络传输层和信息交换层中都应该存在。因此，我们快速来到 `dubbo-remoting-api` 代码工程的 `META-INF/dubbo/internal` 文件夹，发现存在一个 org.apache.dubbo.remoting.Codec2 配置文件，内容如下所示：

```
transport=org.apache.dubbo.remoting.transport.codec.TransportCodec
telnet=org.apache.dubbo.remoting.telnet.codec.TelnetCodec
exchange=org.apache.dubbo.remoting.exchange.codec.ExchangeCodec
```

org.apache.dubbo.remoting.Codec2 配置文件用来执行 SPI 机制，我们会在之后对这个主题进行专项介绍，这里只需要明白 Dubbo 采用这种配置方式来动态加载运行时的类对象。在这里，可以看到 Dubbo 针对 exchange 和 transport 都提供了 Codec 支持。

## 解题要点

从解题思路上讲，序列化是一个相对比较容易把握的面试题。基于本讲关于序列化技术组件的讨论，我们发现有很多列表式的内容需要记忆。这部分内容需要大家平时多看一些资料，尽量扩展自己的知识面，这是针对这一主题的第一个解题要点。关于序列化相关工具之间的对比也有一个非常好的[汇总资料](https://github.com/eishay/jvm-serializers/wiki)

但也正是因为序列化本身是一个内容比较固化的主题，所以在解题上就不能完全照本宣科。只讲概念，而不给出自己的一些思考和总结，往往体现不出你和其他候选人之间的差别，这也是日常面试过程中需要注意的一个点。因此，针对这类题的第二个解题要点在于要事先用自己的语言来梳理回答问题的内容体系，重点展示自己对于这一技术主题的抽象和分析能力。针对技术选型类面试题，更加需要明确给出自己的判断。

## 小结与预告

但凡开发分布式和微服务应用，就一定会使用到序列化技术。可以说，序列化技术是我们开发互联网应用程序的基础设施类技术之一。序列化的实现工具有很多，本讲内容并不是介绍具体的某一个工具，而是从功能、性能以及兼容性等维度出发对这些工具进行分析，从而帮助你更好的进行选择。

具备了网络通信和序列化技术，接下来我们就可以实现一个简单的远程调用过程了。那么，如果让你自己设计一个简单的 RPC 架构，你会怎么做呢？这就是我们下一讲要探讨的内容。

# 远程调用：如果让你自己设计一个简单的 RPC 架构，你会怎么做？

任何分布式系统的开发都涉及到跨进程之间的远程过程调用，也就是所谓的 RPC。前面两讲我们讨论的网络通信和序列化实际上也都属于是 RPC 架构的范畴，只是关注于不同的技术切入点。而 RPC 本身也构成一种架构体系，包含一系列相互协作的核心组件。在 Dubbo、Spring Cloud 等主流的分布式服务框架中，这些技术组件使用起来都非常简单，因为框架为开发人员屏蔽了底层的实现细节。

那么，现在假如没有这些开源框架，而是需要你自己来设计并实现一套远程过程调用机制，你应该怎么做的？我认为这是一个很好的面试题，考查了候选人的综合技术能力。本讲内容将围绕这个话题展开详细讨论。

## 问题背景

在分布式系统中，服务与服务之间需要通过远程调用来完成一个个具体的业务操作。这是一个全流程的执行过程，涉及到前面介绍到的网络通信和序列化技术，也涉及到本讲内容要进一步阐述的远程调用中的不同技术组件。

在使用 Dubbo、Spring Cloud 等框架时，你可能并没有感受到远程调用过程是如何执行的，因为这些框架都提供了“远程调用本地化”机制，开发人员调用远程方法感觉和调用本地方法并没有什么差别。这是框架所具备的能力，我们直接使用即可。但从面试角度讲，如果只考查框架的使用方式，显然无法真正判断候选人的技术能力。因此，在面试过程中，面试官通常都会暂时抛开框架的具体使用方式，而从远程调用的基本概念和执行流程出发来进行提问。

针对这类面试题，如果候选人没有做精心的准备，往往很难回答到位，原因就在于我们平时不大会从这一角度入手考虑问题，也就不会重点关注相关的技术体系。从面试角度讲，这道题也存在一些灵活的提问方式，包括：

- 想要实现远程调用，整个流程应该包含那些基本的技术组件？
- RPC 架构的组成结构是怎么样的？
- 如果让你设计一个简单的 RPC 架构，你会怎么做？
- 你认为 Dubbo 框架中最核心的组件有哪些？

RPC 这个概念我们一直都在说，但面对这一概念，我们应该如何进行系统化的学习呢？我们接下来对这个问题进行分析。

## 问题分析

远程过程调用，英文即为 Remote Procedure Call，也就是我们通常所说的 RPC，这个名词第一次出现是在 1974 年。从诞生到今天，RPC 架构存在了 40 多年，已经演变成一切分布式系统的基础性架构。而围绕 RPC 架构的基本概念，这么多年以来实际上并没有发生大的变化。所以，关于 RPC 架构本身的学习内容和范围是相对固定的，这是我们首先需要明确的一点。

从面试角度讲，RPC 架构最应该掌握的是它的基本组成结构。作为一种架构模式，业界已经对 RPC 架构的各个组成部分进行了抽象和提炼，从而形成一套完整的组件体系。正是基于这套 RPC 的组件体系，业界诞生了各种具体实现框架，Dubbo 就是其中的代表。而无论 Dubbo 等框架如何实现，其底层的组成结构是完全遵循 RPC 架构的。因此，只要掌握了 RPC 架构的组成结构，关于这类问题的大部分内容我们已经可以回答了。

事实上，基于 RPC 的组成结构，任何人都可以自己实现一套 RPC 框架。我们可以采用最简单、最常见的技术体系实现一个最基础的 RPC 架构。通过这一过程，一方面可以确保具体的实现技术和纯粹的理论体系能够对应起来；另一方面，在面试过程中，这也是凸显出个人优势的一个加分项，能够提升面试官对候选人的认可程度。

好了，讲到这里，相信你已经具备了针对这类问题的解答思路。接下来要讨论的就是具体的技术体系了，让我们从 RPC 架构的组成结构开始讲起。

## 技术体系

如果我们站在最高的层次来看 RPC 的执行流程，就是一个服务的消费者向服务的提供者发起远程调用并获取返回结果的过程，如下图所示：

![](res/2024-10-17-10-34-44.png)

接下来，如果我们把上图做一些展开。通过之前的学习，我们知道服务提供者需要暴露服务访问的入口，而消费者则会向提供者所暴露的访问入口发起请求。如下图所示：

![](res/2024-10-17-10-35-20.png)

可以看到，这里我们对服务消费者和提供者的组成结构做了细化，并提取了 RpcChannel、RpcProtocol、RpcConnector 和 RpcAcceptor 这四个技术组件。在这四个技术组件中，前两个属于公共组件，而后两个则面向服务的提供者和服务的消费者，分别用于发起请求和接收响应。

有了底层的用于完成网络通信的技术组件之后，我们再来看如何从业务接口定义和使用的角度出发进一步对 RPC 架构的组成结构进行扩充，如下图所示：

![](res/2024-10-17-10-36-09.png)

上图中出现了用于代表业务接口的 API 组件，同时，我们也看到了分别代表客户端和服务器的 RpcClient 和 RpcServer 组件。我们不难想象这些组件的定位和作用。而这里需要重点介绍的是 RpcCaller 组件和 RpcInvoker 组件。RpcCaller 组件位于服务消费者端，会根据 API 的定义信息发起请求。而 RpcInvoker 组件位于服务提供者端，负责对 RpcServer 执行具体的调用过程并返回结果。

最后，为了对远程调用过程进行更好的控制，我们还会引入两个技术组件，分别是 RpcProxy 和 RpcProcessor。完整的 RPC 架构组成结构如下图所示：

![](res/2024-10-17-10-36-47.png)

从命名上看，位于服务消费者端的 RpcProxy 组件充当了一种代理机制，确保服务消费者能够像调用本地方法一样调用远程服务。而位于服务提供者端的 RpcProcessor 的作用则是为远程调用执行过程添加各种辅助性支持，包括线程管理、超时控制等。

这样，我们对整个 RPC 架构的演进过程做了详细的描述。通过对上图中的技术组件做进一步梳理，我们会发现这些组件可以归为三大类，即客户端组件、服务端组件和公共组件。

其中，客户端组件与职责包括：

- RpcClient，负责导入远程接口代理实现；
- RpcProxy，远程接口的代理实现；
- RpcCaller，负责执行远程调用；
- RpcConnector，负责连接服务器。

服务端组件与职责包括：

- RpcServer，负责导出远程接口；
- RpcInvoker，负责调用服务端接口；
- RpcAcceptor，负责接收网络请求；
- RpcProcessor，负责处理调用过程。

而客户端和服务器端所共有的组件包括：

- RpcProtocol，负责执行网络传输；
- RpcChannel，数据传输的通道。

关于 RPC 架构的组成结构介绍到这里就结束了。在这一组成结构的基础上，如果采用合适的编程语言和实现技术，原则上我们就可以自己动手实现一个 RPC 架构。

## 源码解析

接下来我们通过一个简单的示例来实现前面所介绍的的各个技术组件。该示例的主要目的是演示如何从零开始构建一个最基本的 RPC 架构。

首先我们定义一个业务服务，称为 UserService，包含一个用于根据用户编码获取用户姓名的业务方法，如下所示：

```java
public interface UserService {
    // 根据用户编码获取用户姓名
    public String getUserNameByCode(String userCode);
}
```

UserService 接口的实现类也非常简单，我们通过一个内存 Map 来模拟对数据的存储和查询操作，如下所示：

```java
public class UserServiceImpl implements UserService {

    private Map<String, String> users = new HashMap<String, String>();

    public UserServiceImpl() {
        users.put("user1", "tianyalan1");
        users.put("user2", "tianyalan2");
    }

    @Override
    public String getUserNameByCode(String userCode) {
        return users.get(userCode);
    }
}
```

对于 RPC 架构而言，有了服务定义之后，我们就需要分别构建一个服务端组件 RpcServer 和一个客户端组件 RpcClient。但在这之前，我们首先需要定义一种在客户端和服务器端之间进行通信的消息格式，这里命名为 Protocol，如下所示：

```java
public class Protocol implements Serializable {
   // 包名 + 接口名称
   private String interfaceName;
   // 调用方法名
   private String methodName;
   // 参数类型：按照接口参数顺序
   private Class[] paramsTypes;
   // 参数：按照接口参数顺序
   private Object[] parameters;

   public Protocol (String interfaceName, String methodName, Class[] paramsTypes, Object[] parameters) {
      super();
      this.interfaceName = interfaceName;
      this.methodName = methodName;
      this.paramsTypes = paramsTypes;
      this.parameters = parameters;
   }
   // 省略 getter/setter 方法
}
```

可以看到 Protocol 中定义了一次服务请求所需要的接口名、方法名以及方法调用所需要的参数。注意到该类同时实现了 Serializable 接口，这是 Java 中的序列化接口，实现该接口的类能够通过网络进行远程传输。在 RPC 基础架构图中，Protocol 类相当于是通过 RpcProtocol 进行传递的请求数据。

接下来我们考虑构建 RpcServer 类，该类需要实现 RPC 基础架构图中的各个服务端组件。RpcServer 类完整代码如下所示：

```java
public class RpcServer {
    // 线程池
    private int threadSize = 10;
    private ExecutorService threadPool;
    // 自定义缓存
    private Map<String, Object> servicePool;
    // 服务端口
    private int port = 9000;

    public RpcServer() {
        super();
        synchronized (this) {
            threadPool = Executors.newFixedThreadPool(this.threadSize);
        }
    }

    public RpcServer(int threadSize, int port) {
        this.threadSize = threadSize;
        this.port = port;
        synchronized (this) {
            threadPool = Executors.newFixedThreadPool(this.threadSize);
        }
    }

    public RpcServer(Map<String, Object> servicePool, int threadSize, int port) {
        this.threadSize = threadSize;
        this.port = port;
        this.servicePool = servicePool;
        synchronized (this) {
            threadPool = Executors.newFixedThreadPool(this.threadSize);
        }
    }

    // 1. 实现 Socket 监听：RpcAcceptor
    public void service() throws IOException {
        ServerSocket serverSocket = new ServerSocket(port);
        while (true) {
            Socket receiveSocket = serverSocket.accept();
            final Socket socket = receiveSocket;

            // 执行请求
            threadPool.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        // 2. 处理请求
                        process(socket);

                        socket.close();
                    } catch(IOException e) {
                        // 篇幅关系，省略对各种异常信息的处理
                    }
                }
            });
        }
    }

    // 2.处理请求：RpcProcessor
    private void process(Socket receiveSocket) throws IOException, ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        ObjectInputStream objectInputStream = new ObjectInputStream(receiveSocket.getInputStream());

        Protocol protocol = (Protocol)objectInputStream.readObject();

        // 调用服务
        Object result = call(protocol);

        ObjectOutputStream objectOutputStream = new ObjectOutputStream(receiveSocket.getOutputStream());
        objectOutputStream.writeObject(result);
        objectOutputStream.close();
    }

    // 3.执行方法调用：RpcInvoker
    private Object call(Protocol protocol) throws ClassNotFoundException, NoSuchMethodException,
            IllegalAccessException, InstantiationException, InvocationTargetException {
        if(servicePool == null) {
            synchronized (this) {
                servicePool = new HashMap<String, Object>();
            }
        }

        // 通过接口名称构建实现类
        String interfaceName = protocol.getInterfaceName();
        Object service = servicePool.get(interfaceName);
        Class<?> serviceClass = Class.forName(interfaceName);

        // 判断 servicePool 对象是否存在，如果不存在，就创建新对象并放入池中
        if(service == null) {
            synchronized (this) {
                service = serviceClass.newInstance();
                servicePool.put(interfaceName, service);
            }
        }

        // 通过实现类来构建方法
        Method method = serviceClass.getMethod(protocol.getMethodName(), protocol.getParamsTypes());

        // 通过反射来实现方法的执行
        Object result = method.invoke(service, protocol.getParameters());
        return result;
    }
}
```

RpcServer 类代码相对比较长，我们结合 RPC 基本架构对其进行分段解析。

- service 方法

   service 方法接收请求并基于 Socket 启动端口监听，通过线程池为进入的每个请求启动一个线程进行处理。就 RPC 基础架构而言，该 service 方法相当于扮演 RpcAcceptor 的角色。

- process 方法

   service 方法启动了线程池，而每个线程负责执行 process 方法。这里的 process 方法从 Socket 中获取输入流，然后把输入流中的数据转化为 Protocol，从而获取远程方法调用的各项元数据。就 RPC 基础架构而言，该 process 方法充当了 RpcProcessor 的角色。

- call 方法 一旦获取 Protocol，process 方法就调用内部的 call 方法来执行真正的方法调用。这里通过反射机制获取位于服务器端的方法并进行执行。显然，该 call 方法对应于 RpcInvoker 角色。

介绍完 RpcServer 中的各个技术组件，我们再来看一下 RpcClient 的代码，如下所示：

```java
public class RpcClient {
    private String serverAddress;
    private int serverPort;

    public RpcClient(String serverAddress, int serverPort) {
         this.serverAddress = serverAddress;
         this.serverPort = serverPort;
    }

    // RpcConnector + RpcCaller
    public Object sendAndReceive(Protocol protocol) {
         Object result = null;

         try {
            Socket socket = new Socket(serverAddress, serverPort);
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            objectOutputStream.writeObject(protocol);

            ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());
            result = objectInputStream.readObject();
         } catch (Exception e) {
            // 篇幅关系，省略对各种异常信息的处理
         }

         return result;
    }
    // 省略 getter/setter 方法
}
```

RpcClient 类的代码相对比较简单，主要就是根据远程服务的地址通过 Socket 发起通信，传入一个 Protocol 对象并返回远程调用的结果。

完成了 RpcServer 和 RpcClient 类之后，我们就可以编写一些测试用例来进行验证。验证方法就是启动 RpcServer，然后通过 RpcClient 执行远程调用。这里我们编写一个 ServerTest 来启动 RpcServer，如下所示：

```java
public class ServerTest {
    public static void main(String[] args) {
        Map<String, Object> servicePool = new HashMap<String, Object>();
        servicePool.put("com.juejin.rpc.service.UserService", new UserServiceImpl());

        RpcServer server = new RpcServer(servicePool, 4, 9000);

        try{
            server.service();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

然后我们再编写一个 ClientTest 对远程服务发起请求，整个过程如下所示：

```java
public class ClientTest {
    public static void main(String[] args) {
        String serverAddress = "127.0.0.1";
        int serverPort = 9000;

        RpcClient client = new RpcClient(serverAddress, serverPort);
        Protocol protocol = buildProtocol("user1");
        Object result = client.sendAndReceive(protocol);
        System.out.println(result);

        protocol = buildProtocol("user2");
        result = client.sendAndReceive(protocol);
        System.out.println(result);
    }

    private static Protocol buildProtocol(String userCode) {
        String interfaceName = "com.juejin.rpc.service.UserService";
        Class[] paramsTypes = {String.class};
        Object[] parameters = {userCode};
        String methodName = "getUserNameByCode";

        Protocol protocol = new Protocol(interfaceName, methodName, paramsTypes, parameters);
        return protocol;
    }
}
```

至此，我们构建了一个简洁但又完整的 RPC 架构。通过这个示例，我们可以对 RPC 的整体结构有一个清晰的认识。事实上，无论是多么复杂的 RPC 框架，都是从这样的基础架构开始逐步演进而来。

## 解题要点

围绕 RPC 架构，我们首先要明确的第一个解题要点就是它的组成结构。RPC 架构的组成呈现一种非常标准的对称结构，围绕远程调用过程，我们可以提炼出一组分别针对服务消费者和服务提供者的技术组件。把各个技术组件进行分类梳理是一种有助于记忆的学习方法，你也可以尝试能不能对这一组成结构再做进一步的细化。

RPC 架构的组成结构偏向理论描述，想要理解该架构中各个技术组件的具体实现过程，一种有效的方法就是自己动手做一些实践。而面试官实际上也非常看重候选人的这种实践能力，所以会以发散式的提问方式来考查候选人对 RPC 架构的掌握能力。基于本讲中给出的案例，你可以结合 RPC 架构的理论知识以及具体的代码实现过程来应对这种发散式的面试题。

最后，从本讲开头罗列的一些面试题可以看出，面试官往往会把 RPC 架构的组成结构和具体的 RPC 开源框架组合在一起进行提问。而在本讲内容中，我们也发现组成 RPC 架构的这些技术组件具有演进性。我们可以从最基本的组件出发，逐步进行扩展和完善，直至形成一个完整的技术体系。也就是说，我们可以从一个基础架构出发来系统掌握大型开源框架的实现原理。

## 小结与预告

想要掌握分布式服务框架，首先得掌握 RPC 架构。

本讲内容对 RPC 架构的组成结构进行了详细的介绍。同时，我们也针对 RPC 架构所需要实现的各个技术组件，提供了一个简洁但又完整的示例，从而有助于你对该架构有一个感性的认识。可以说，RPC 是分布式系统中一项基础设施类的技术体系，但凡涉及到服务与服务之间的交互就需要使用到 RPC 架构。当你在使用一个分布式框架时，可以尝试使用今天介绍的 RPC 架构的基本结构进行分析，从而加深对这项技术体系的理解。

在掌握了 RPC 架构的基本结构并动手实现了一个简易版的示例之后，让我们回到主流的开源框架，看看这些框架是如何实现远程调用的。远程调用涉及到服务发布和服务引用这两个方面。我们将先对前者展开讨论，并回答这样一个问题：如何合理设计服务发布机制？我们下一讲再聊。

# 远程调用：如何合理设计服务发布机制？

在上一讲中，我们通过一个简单但又完整的示例演示了如何实现一套自定义的 RPC 架构。在现实开发场景中，我们当然不建议大家重复造轮子，而是应该采用主流的 Dubbo、Spring Cloud 等开源框架来构建分布式系统。对于这些开源框架而言，RPC 架构的实现过程显然不会像上一讲中的示例那样简单，而是内置了各种强大的功能，从而为开发人员提供更好的开发体验。

本质上，一次远程调用涉及两个角色，即服务提供者和服务消费者，分别用来实现服务的发布和引用。在本讲内容中，我们将讨论服务的发布过程，并引出一个常见的面试题，即：如何合理设计服务发布机制？

## 问题背景

在分布式系统中，系统的能力来自于服务与服务之间的交互和集成。为了实现这一过程，就需要服务提供者对外暴露可以访问的入口。假设我们沿用上一讲中所介绍的业务服务 UserService，那么对该服务进行发布的一种实现方式如下所示：

```java
UserService service = new UserServiceImpl(...)；
RpcServer server = new RpcServer(…);
server.export(UserService.class, options);
```

上述代码看上去也很简单，和我们在上一讲中所实现的示例代码有点类似。但在这几行代码的背后，我们需要考虑的事情非常多，比方说：

- 如果远程调用发生在同一个 JVM 中，服务发布应该如何实现？
- 如果我们想要在服务发布过程中添加一些定制化的切面逻辑，应该怎么做？
- 如果服务提供者具有多个服务实例，那么服务发布过程如何实现集群化？
- 如果服务发布操作还没完成，服务消费者的请求就进来了应该怎么办？

这些问题面向服务发布主流程中的特定场景，但正是这些特定场景才是面试过程中经常会出现的提问方式。同时，我们也应该注意到，远程调用是一个消耗大量资源的过程，资源的利用率也是框架必须要考虑的问题。如何合理地利用资源，避免远程通信所导致的性能消耗，也是服务发布机制设计上的一个重点。

如果针对 Dubbo 等具体的实现框架，面试官也可以这样来进行提问：

- Dubbo 中所采用的服务发布流程是怎么样的？
- Dubbo 框架中提供了哪几种服务发布机制？
- 为了提高资源利用的效率，Dubbo 在发布过程中做了哪些优化？

这些问题看上去侧重点各有不同，但其实都是围绕着一套服务发布流程来展开的，让我们来对这些问题做进一步分析。

## 问题分析

和前面几讲介绍的网络通信、序列化等主题不同，服务的发布和引用更多关注的是应用层的设计方法，而不是面向底层网络的通信组件。因此，我们对服务发布的分析也需要从应用层的角度进行切入，梳理一套通用而又完整的服务发布流程。而为了实现这一目标，就需要对业界主流的一些开源框架做一定的提炼和抽象。这是我们在应对这类面试题要把握的第一个方向。

然后，我们在这套流程中进一步提炼服务发布过程中所使用到的各个技术组件，这些技术组件能够与前面给出的特定场景下的面试问题相对应。这是我们要回答的第二个主要方向。

最后，我们还是要回到具体的实现框架，从源码切入来详细分析开源框架中针对服务发布机制的实现原理。只有这样，才能做到理论联系实际，也有助于我们更好地掌握开源框架的使用方式和技巧。

上述三个维度构成了我们回答这类问题的解答思路。接下来要讨论的就是具体的技术体系了，让我们给出对服务发布流程的统一描述。

## 技术体系

在现代的分布式架构中，服务的发布和引用过程往往与注册中心密切相关。服务注册中心是服务发布和引用的媒介，当我们把服务信息注册到注册中心，并能够从注册中心中获取服务调用地址时，需要考虑的问题就是如何进行有效的服务发布和引用。我们会在后面介绍注册中心，而在本讲接下来的内容中，我们重点关注的是服务发布所具备的流程和特性。

我们知道服务发布的目的是将该服务的访问入口暴露给分布式系统中的其他服务。抛开具体的技术和框架，我们先可以简单抽象出如下图所示的服务发布的整体流程：

![](res/2024-10-23-11-11-30.png)

上图包含了服务发布过程中的核心组件，我们来对这些核心组件做一一展开。

1. 发布启动器

   发布启动器的核心作用有两点，一个是确定服务的发布形式，一个是启动服务发布过程。在目前主流的开发框架中，常见的服务发布形式包括：

   - 配置化：使用配置文件；
   - 使用注解：使用 Java 中的注解机制；
   - API 调用：使用底层的代码接口。

   以上三种方式各有利弊。在日常开发过程中，配置和注解比较常用，而 API 调用则主要完成服务与服务之间的集成。

   讲完发布形式，我们来讨论如何启动服务发布过程，常见的策略如下图所示：

   ![](res/2024-10-23-11-12-57.png)

   可以看到，我们可以使用 Spring 容器来完成基于配置化和注解形式下的服务启动过程。而对于 API 调用而言，由于不一定会借助于容器，所以也可以直接使用 main 函数来实现这一目标。

2. 动态代理

   动态代理是远程过程调用中非常核心的一个技术组件，在服务发布和服务引用过程中都会用到，其主要作用就是简化服务发布和引用的开发难度，以及确保能够对发布过程进行扩展和定制。

   关于动态代理的具体实现方式值得专门进行讨论，我们将在后面重点关注这一话题。

3. 发布管理器

   服务发布过程需要使用专门的组件来进行统一管理，这个组件就是发布管理器。该组件需要判断本次发布是否成功，然后在服务发布成功之后，把服务的地址信息注册到注册中心。而这里的服务地址信息则来自于协议服务器。

4. 协议服务器

   在服务发布过程中，在物理上真正建立网络连接，并对网络端口进行绑定的组件是协议服务器。协议服务器还会执行心跳检测以及在连接失败之后进行重连操作。用于发布服务的常见协议包括 HTTP、RMI、Hessian 等。我们也可以自己定义这样的协议，例如 Dubbo 框架就实现了一套自定义的 Dubbo 协议。实际上，关于网络通信方面的讨论就是针对这里的协议服务器。

5. 注册中心

   注册中心的作用是存储和管理服务定义的各类元数据，并能感知到这些元数据的变化。

以上所示的服务发布流程图有一定的共性，可以通过转化映射到具体的某个框架。事实上，基于 Dubbo 的服务发布流程与上述过程非常类似。让我们来一起看一下。

## 源码解析

在具体介绍 Dubbo 服务发布流程之前，我们先来讨论 Dubbo 暴露服务的两种时效，一种是延迟暴露，一种是正常暴露，如下图所示：

![](res/2024-10-23-11-14-30.png)

可以看到，如果这里的 delay 参数被设置成了 -1，代表不需要延迟暴露。反之，Dubbo 会根据该参数值的大小来执行对应的延迟策略。讲到这里，你可能会问，Dubbo 为什么要考虑发布时效这个问题呢？主要目的在于提供平滑发布机制。如果 Dubbo 服务本身还没有完全启动成功，那这时候对外暴露服务是没有意义的，我们可以通过设置延迟时间来确保服务在发布的时间点上就是可用的。

在判断是否需要延迟暴露之后，ServiceBean 就会调用 export 方法执行服务暴露。而 export 方法又来自 ServiceBean 的父类 ServiceConfig，所以关于 Dubbo 服务发布的流程就从 ServiceConfig 类进行切入。

那么，ServiceConfig 是如何实现延迟暴露的呢？实际上很简单，就是启动一个后台线程来延迟调用一个 doExport 方法，该方法负责执行具体的服务暴露逻辑。而如果没有采用延迟暴露策略，那么这个 doExport 方法就会被立即执行，具体的执行流程如下所示：

```java
// 将 Bean 属性转化为 URL
URL url = new URL(name, host, port, (contextPath == null || contextPath.length() == 0 ? "" : contextPath + "/") + path, map);

String scope = url.getParameter(Constants.SCOPE_KEY);
// 如果 scope 配置为 none 则不暴露
if (!Constants.SCOPE_NONE.toString().equalsIgnoreCase(scope)) {
            // 如果 scope 没有被配置为远程暴露，则采用本地暴露
            if (!Constants.SCOPE_REMOTE.toString().equalsIgnoreCase(scope)) {
                exportLocal(url);
            }
            // 如果 scope 没有被配置为本地暴露，则采用远程暴露
            if (!Constants.SCOPE_LOCAL.toString().equalsIgnoreCase(scope)) {
                if (registryURLs != null && registryURLs.size() > 0) {
                    for (URL registryURL : registryURLs) {
                        // 将具体服务转化为 Invoker
                        Invoker<?> invoker = proxyFactory.getInvoker(ref, (Class) interfaceClass, registryURL.addParameterAndEncoded(Constants.EXPORT_KEY, url.toFullString()));
                        DelegateProviderMetaDataInvoker wrapperInvoker = new DelegateProviderMetaDataInvoker(invoker, this);

                        // 将 Invoker转化为 Exporter
                        Exporter<?> exporter = protocol.export(wrapperInvoker);
                        exporters.add(exporter);
                    }
                } else {
                    Invoker<?> invoker = proxyFactory.getInvoker(ref, (Class) interfaceClass, url);
                    DelegateProviderMetaDataInvoker wrapperInvoker = new DelegateProviderMetaDataInvoker(invoker, this);

                    Exporter<?> exporter = protocol.export(wrapperInvoker);
                    exporters.add(exporter);
                }
            }
}
this.urls.add(url);
```

这段代码值得仔细分析。在这里，我们可以看到首先会构建一个 URL 对象，如下所示：

```java
URL url = new URL(name, host, port, (contextPath == null || contextPath.length() == 0 ? "" : contextPath + "/") + path, map);
```

请注意，在 Dubbo 中，URL 对象代表了统一数据模型，会贯穿服务暴露和调用的整个流程，绝对是一等公民。URL 格式如下所示：

```
protocol://username:password@host:port/path?key=value&key=value
```

当不使用注册中心时，URL 表现形式比较简单，如下所示：

```
dubbo://service-host/com.foo.FooService?version=1.0.0
```

而当使用注册中心时，URL 中会带有注册中心信息，如下所示：

```
registry://registry-host/org.apache.dubbo.registry.RegistryService?export=URL.encode("dubbo://service-host/com.foo.FooService?version=1.0.0")
```

通过分析 Dubbo 源码，我们得到将配置信息通过一种统一的 URL 进行表示和传递的实现方法，这也是值得我们学习的一个设计技巧。

接着，我们根据 scope 参数判断服务的发布范围，判断规则如下图所示：

![](res/2024-10-23-11-16-33.png)

关于本地服务的暴露我们后面再具体展开，这里先讨论远程服务暴露的场景。

### 远程服务暴露

在 Dubbo 中，远程服务暴露过程需要执行非常重要的一个步骤，即将具体服务对象转换到 Invoker，如下所示：

```java
Invoker<?> invoker = proxyFactory.getInvoker(ref, (Class) interfaceClass, registryURL.addParameterAndEncoded(Constants.EXPORT_KEY, url.toFullString()));
```

这里看到了一个 proxyFactory 对象，从命名上不难看出它是一个代理工厂类，定义如下所示：

```java
@SPI("javassist")
public interface ProxyFactory {
   @Adaptive({Constants.PROXY_KEY})
   <T> T getProxy(Invoker<T> invoker) throws RpcException;

   @Adaptive({Constants.PROXY_KEY})
   <T> Invoker<T> getInvoker(T proxy, Class<T> type, URL url) throws RpcException;
}
```

在 Dubbo 中，该接口有两个实现类，即 JdkProxyFactory 和 JavassistProxyFactory。我们来看 JdkProxyFactory 中的 getInvoker 方法实现，如下所示：

```java
public <T> Invoker<T> getInvoker(T proxy, Class<T> type, URL url) {
        return new AbstractProxyInvoker<T>(proxy, type, url) {
            @Override
            protected Object doInvoke(T proxy, String methodName, Class<?>[] parameterTypes, Object[] arguments) throws Throwable {
                Method method = proxy.getClass().getMethod(methodName, parameterTypes);
                return method.invoke(proxy, arguments);
            }
        };
}
```

可以看到这里返回了一个 AbstractProxyInvoker 对象，而 AbstractProxyInvoker 实现了 Invoker 接口。Invoker 接口定义如下所示：

```java
public interface Invoker<T> extends Node {
   // 获取服务接口
   Class<T> getInterface();
   // 执行远程调用
   Result invoke(Invocation invocation) throws RpcException;
}
```

Dubbo 为我们提供了一组 Invoker 接口的实现类，其中包括前面看到的 AbstractProxyInvoker。

我们已经在 JavaProxyFactory 中看到了构建一个 Invoker 对象的实现过程，背后使用的本质上就是反射机制。

现在我们明白了，Invoker 就是 Dubbo 实现远程调用的实体类。对于服务发布和引用而言，这个 Invoker 贯穿始终，可以说也是一个一等公民。

有了 Invoker 之后，我们再来关注 Exporter。我们看到 Exporter 是通过调用 Protocol 接口的 export 方法所生成的，这就需要我们对 Procotol 做一些回顾。Protocol 作为 Dubbo 中最基本的 RPC 组件，完成了服务的发布和调用功能，该接口定义如下所示：

```java
@SPI("dubbo")
public interface Protocol {
int getDefaultPort();
   @Adaptive
   <T> Exporter<T> export(Invoker<T> invoker) throws RpcException;

   @Adaptive
   <T> Invoker<T> refer(Class<T> type, URL url) throws RpcException;

   void destroy();
}
```

从方法命名上不难看出，Protocol 接口中的核心方法就是 export 和 refer，前者用于对外暴露服务，而后者则用来对远程服务进行引用。当 Dubbo 获取 URL 之后会将 URL 传给 Protocol，Protocol 根据 URL 的协议头执行不同协议的服务暴露或引用。

关于 URL 的格式我们在前面已经给出说明和示例。根据 URL 中是否包含注册中心信息，服务发布流程也会判断是否需要与注册中心进行交互。关于注册中心的讨论我们放在后面进行详细展开。这里给出不基于注册中心的服务暴露方式，即如下所示的 DubboProtocol 中 export 方法的实现过程。

```java
public <T> Exporter<T> export(Invoker<T> invoker) throws RpcException {
   URL url = invoker.getUrl();

   // 暴露服务
   String key = serviceKey(url);
   DubboExporter<T> exporter = new DubboExporter<T>(invoker, key, exporterMap);
   exporterMap.put(key, exporter);

   // 创建 Exchange 服务器
   openServer(url);

   return exporter;
}
```

这里的 openServer 方法的目标是创建 Exchange 服务器，这是整个服务发布流程中的底层部分，我们已经在 `网络通信：如何完成客户端和服务端之间的高效通信` 中做了详细介绍，你可以做相应的回顾。

作为总结，我们把整个远程服务暴露流程做一个梳理，得到如下图所示的核心对象交互图：

![](res/2024-10-23-11-18-42.png)

关于 Dubbo 中远程服务暴露的实现过程就介绍到这里，接下来我们讨论本地服务暴露过程。

### 本地服务暴露

我们回顾 ServiceConfig 中的服务暴露流程，存在如下所示的一个流程分支：

```java
if (!Constants.SCOPE_REMOTE.toString().equalsIgnoreCase(scope)) {
   exportLocal(url);
}
```

可以看到，如果 scope 没有被设置为远程暴露，则采用本地暴露模式暴露服务。那么，什么样的场景适合这种服务暴露模式呢？我们知道远程调用只会发生在跨 JVM 的场景，如果在同一个 JVM 中同时存在某一个服务的提供者和消费者，那么就可以将服务发布和引用过程控制在同一个 JVM 之内，从而避免远程网络通信所导致的性能消耗。

Dubbo 中提供的 exportLocal 方法实现了这一过程，如下所示：

```java
private void exportLocal(URL url) {
   if (!Constants.LOCAL_PROTOCOL.equalsIgnoreCase(url.getProtocol())) {
      URL local = URL.valueOf(url.toFullString())
               .setProtocol(Constants.LOCAL_PROTOCOL)
               .setHost(LOCALHOST)
               .setPort(0);
      Exporter<?> exporter = protocol.export(proxyFactory.getInvoker(ref, (Class) interfaceClass, local));
      exporters.add(exporter);
   }
}
```

这里的特殊之处就在于当碰到场景为 local 的 URL 时，我们将它的协议设置为了 `Constants.LOCAL_PROTOCOL`，即 `injvm`。我们不难猜到 Protocol 接口应该存在一个名为 InjvmProtocol 的实现类。跟 DubboProtocol 相比，InjvmProtocol 的 export 方法就显得非常简单了，如下所示：

```java
public <T> Exporter<T> export(Invoker<T> invoker) throws RpcException {
   return new InjvmExporter<T>(invoker, invoker.getUrl().getServiceKey(), exporterMap);
}
```

可以看到，这里没有执行任何关于远程调用的操作，而是构建了一个 InjvmExporter 对象并直接返回，InjvmExporter 类的定义如下所示：

```java
class InjvmExporter<T> extends AbstractExporter<T> {
   private final String key;
   private final Map<String, Exporter<?>> exporterMap;

   InjvmExporter(Invoker<T> invoker, String key, Map<String, Exporter<?>> exporterMap) {
      super(invoker);
      this.key = key;
      this.exporterMap = exporterMap;
      exporterMap.put(key, this);
   }

   public void unexport() {
      super.unexport();
      exporterMap.remove(key);
   }

}
```

看到这里，我们明白了所谓的本地暴露，Dubbo 只是将 InjvmExporter 对象放置到一个 Map 内存对象中。这样，我们就可以直接从 JVM 的内存中获取 InjvmExporter 对象来完成服务之间的调用。

## 解题要点

本讲介绍的服务发布机制以及下一讲要介绍的服务引用过程都是属于技术实现流程类的面试题，这种面试题想要回答得很到位是有难度的，需要具备高度的抽象能力。本讲对这些流程进行了梳理，面试者只要对有一个基本的认识，就能从动态代理、协议、注册中心等关键技术组件出发，并对这些组件的作用和运行机制做一些展开。这样，面试官的主要考察目标基本就能满足了。

请注意，考查技术实现流程性的面试题还有一个特点，就是它会关联到多个技术组件，相信你从本讲中所引用的其他各讲的数量就能感受到这一点。服务的发布需要注册中心，也需要底层的网络通信。在面试过程中，我们需要点到这些关联性的技术组件，并挑选自己比较熟悉的方向进行展开。

最后，我们同样建议基于具体的开源框架来展开对技术实现流程的讨论。对于 Dubbo 框架，建议不用做过多展开，只需要点到最核心的几个概念即可，例如远程服务暴露和本地服务暴露这两种服务暴露类型。然后，我们也可以重点对 Dubbo 框架中的核心对象做一些分析，例如 URL 对象和 Invoker 对象。

## 小结与预告

在远程过程调用的实现流程上，主要包括服务发布和服务引用两大维度。

本讲内容围绕远程调用的发布流程展开了详细的讨论，这部分内容是我们构建分布式系统的基本前提。同时，基于这套服务发布流程，我们对 Dubbo 这款主流的分布式服务框架的内部实现原理，即如何完成远程/本地服务暴露的过程进行分析。

介绍完服务发布流程和实现原理之后，下一讲我们继续讨论远程过程调用，我们要回答的一个核心问题是：服务引用有哪些实现方式？同样，我们也会基于 Dubbo 框架给出这个问题的答案。

# 远程调用：服务引用有哪些实现方式？

在上一讲中，我们介绍了远程过程调用中的服务发布流程。我们知道服务发布的过程就是服务提供者对外暴露可访问入口的过程。基于所暴露的访问入口，服务消费者就可以成功发起远程调用。我们把这个过程称为服务引用。

和服务发布类似，服务引用也具备一套完整的执行流程。那么，服务引用有哪些具体的实现方式呢？这就是本讲要介绍的内容。

## 问题背景

在分布式系统中，系统的能力来自于服务与服务之间的交互和集成。为了实现这一过程，就需要服务消费者对服务提供者所暴露的入口进行访问。假设我们继续使用 UserService 作为业务接口，那么服务引用的一种表现形式可以采用如下所示的代码风格：

```java
RpcClient client = new RpcClient(…);
UserService service = client.refer(UserService.class);
service.getUserNameByCode("user1");
```

和服务发布的过程类似，服务引用看上去并不复杂，但背后要考虑的事情也非常多，包括：

- 如何实现远程调用过程的透明化？
- 如何使用缓存机制提高远程调用的效率？
- 除了缓存机制，你还有什么办法可以提高远程调用的性能？
- 如何实现异步调用、泛化调用等多种调用形式？

实际上，相较服务发布，服务引用是一个更为复杂的话题，涉及的技术组件众多。后续几讲要介绍的负载均衡、服务容错等机制都发生在服务引用阶段，这些机制对于服务发布而言是不需要考虑的。

当然，如果针对 Dubbo 等具体的实现框架，面试官也可以这样来进行提问：

- Dubbo 中所采用的服务引用流程是怎么样的？
- Dubbo 框架中提供了哪几种服务调用方式？

同样，这些问题看上去侧重点各有不同，但其实都是围绕着一套服务引用流程来展开的，让我们来对这些问题做进一步分析。

## 问题分析

对于远程过程调用而言，服务引用和服务发布是两个对应的技术组件。因此，上一讲中所有关于服务发布的问题分析方法同样适用于服务引用过程，这部分内容这里就不一一展开，你可以参考上一讲内容做一些回顾。

然而，对于服务引用而言，也存在与服务发布不一样的地方。首要一点在于服务引用的类型可以是多样的，我们可以使用同步调用、异步调用等多种方式来完成远程调用过程。

在日常开发过程中，开发人员倾向于使用同步调用模式来完成远程调用，因为这一模式对于编码过程而言非常友好。而从性能上讲，异步调用模式显然更具优势，但实现复杂度较高。这就诞生了一种新的实现机制，即 `异步转同步`，诸如 Dubbo 等框架就内置了这种实现机制。

在面试过程中，除了介绍通用的服务引用流程，候选人最好能够对服务的引用类型，以及异步转同步这一特定技术实现机制做一定的展开，这些都是提高面试成功率的加分项。

## 技术体系

### 通用服务引用流程

相较服务发布，服务的调用是一个导入（Import）的过程，整体流程如下图所示：

![](res/2024-10-28-18-24-26.png)

在上图中，我们可以看到服务调用流程与服务发布流程呈对称结构，所包含的组件包括以下。

1. 调用启动器。调用启动器和上一讲介绍的发布启动器是对应的，这里不再重复介绍。

2. 动态代理。在服务引用过程中，动态代理的作用就是确保远程调用过程的透明化，即开发人员可以使用本地对象来完成对远程对象的处理，如下图所示：

   ![](res/2024-10-28-18-26-12.png)

3. 调用管理器。和发布管理器相比，调用管理器的核心功能是提供了一种缓存机制，从而根据保存在服务调用者本地的远程服务地址信息来发起调用。
4. 协议客户端。和协议服务器相对应，协议客户端会创建与服务端的网络连接，发起请求并获取结果。
5. 注册中心。注册中心在这里的作用是提供查询服务定义元数据的入口。

以上所示的服务引用流程图同样有一定的共性，可以通过转化映射到具体的某个框架。事实上，基于 Dubbo 的服务引用流程与上述过程也比较类似。

另一方面，与服务发布相比，Dubbo 等分布式服务框架中的服务引用整体过程会更加复杂一点。在服务调用过程中，因为面对的服务一般都会部署成集群模式，势必涉及到负载均衡。而如果调用超时或失败，还会采用集群容错机制。关于负载均衡和集群容错等内容不在这里讨论，我们在介绍完本讲内容之后马上就会有专门的主题进行详细阐述。

### 服务调用的类型

服务调用存在两种基本方式，即同步调用模式和异步调用模式。其中，同步调用的示意图如下图所示：

![](res/2024-10-28-18-27-34.png)

可以看到，同步调用的执行流程比较简单。在同步调用中，服务消费者在获取来自服务提供者的响应结果之前一直处于等待状态。

而异步调用则不同，服务消费者一旦发送完请求之后就可以继续执行其他操作，直到服务提供者异步返回结果并通知服务消费者进行接收，如下图所示：

![](res/2024-10-28-18-28-09.png)

显然，使用异步调用的目的在于获取高性能。但是，异步调用的开发过程比较复杂，对开发人员的要求较高，所以很多 RPC 框架提供了专门的异步转同步机制，即面向开发人员提供的是同步调用的 API，而具体执行过程则使用的是异步机制。

除了同步和异步调用之外，还存在并行（Parallel）调用和泛化（Generic）调用等调用方法，这些调用方式并不常见，我们不做具体展开。

## 源码解析

与 ServiceConfig 中的 export 方法相对应，ReferenceConfig 中也存在一个 init 方法，该方法就是 Dubbo 服务引用流程的入口。

### 服务引用

在 ReferenceConfig 的 init 方法中，Dubbo 做了非常多的准备和校验工作，最终来到了如下所示的这行代码中：

```java
ref = createProxy(map);
```

这个 createProxy 方法是理解服务引用的关键入口，我们梳理它的主体结构如下所示：

```java
private T createProxy(Map<String, String> map) {
       if (isJvmRefer) {
            // 生成本地引用 URL，使用 injvm 协议进行本地调用
            URL url = new URL(Constants.LOCAL_PROTOCOL, NetUtils.LOCALHOST, 0, interfaceClass.getName()).addParameters(map);
            invoker = refprotocol.refer(interfaceClass, url);
        } else {
            if (url != null && url.length() > 0) {
                // URL 不为空，执行点对点调用
            } else {
                // 加载注册中心 URL
            }

            if (urls.size() == 1) {
                // 单个服务提供者，直接调用
                invoker = refprotocol.refer(interfaceClass, urls.get(0));
            } else {
                // 多个服务提供者
                List<Invoker<?>> invokers = new ArrayList<Invoker<?>>();
                URL registryURL = null;
                for (URL url: urls) {
                    invokers.add(refprotocol.refer(interfaceClass, url));
                    if (Constants.REGISTRY_PROTOCOL.equals(url.getProtocol())) {
                        registryURL = url;
                    }
                }
                if (registryURL != null) {
                    // 如果注册中心链接不为空，则将使用 AvailableCluster
                    URL u = registryURL.addParameter(Constants.CLUSTER_KEY, AvailableCluster.NAME);
                    invoker = cluster.join(new StaticDirectory(u, invokers));
                } else {
                    invoker = cluster.join(new StaticDirectory(invokers));
                }
           }

           // 生成服务代理类
           return (T) proxyFactory.getProxy(invoker);
}
```

虽然 createProxy 方法的代码比较长，但它的执行逻辑还是比较清晰的。首先我们根据配置检查是否为本地调用，如果是则调用 InjvmProtocol 的 refer 方法生成 InjvmInvoker 实例；如果不是，则读取 URL 配置项，包括用于直联的 URL 或基于注册中心的 URL。

然后，我们对 URL 对象数量进行判断。如果 URL 数量为 1，则直接通过 Protocol 构建 Invoker 对象；如果 URL 数量大于 1，即存在多个服务地址，此时先根据每个 URL 构建 Invoker，然后再通过集群对象 Cluster 合并多个 Invoker，最后调用 ProxyFactory 生成代理类。

这个过程实际上完成了两个步骤，首先是创建 Invoker 对象，然后才是生成服务代理类，如下图所示：

![](res/2024-10-28-18-29-25.png)

显然，上述流程中，我们需要重点关注服务引用过程中 Invoker 对象的构建过程。那么问题来了，这里的这个 Invoker 是从何而来呢？实际上，Invoker 的构建过程是在 Protocol 中。与服务暴露的讲解思路一样，我们将从 DubboProtocol 这个 Protocol 的 refer 方法入手，如下所示：

```java
public <T> Invoker<T> refer(Class<T> serviceType, URL url) throws RpcException {
        DubboInvoker<T> invoker = new DubboInvoker<T>(serviceType, url, getClients(url), invokers);
        invokers.add(invoker);
        return invoker;
}
```

这里出现了一个 getClients 方法，该方法用于获取客户端实例，实例类型为 ExchangeClient。我们已经在介绍 Dubbo 客户端通信原理时介绍过 ExchangeClient，可以参考前面做一些回顾。在理解了 getClients 方法之后，我们发现 DubboProtocol 的 refer 方法的作用就是返回一个新建的 DubboInvoker。

DubboInvoker 继承了 AbstractInvoker，而 AbstractInvoker 实现了 Invoker 接口。AbstractInvoker 是一个抽象的模板方法类，提供了一个 doInvoke 模板方法。我们来看 DubboInvoker 中如何实现了这个模板方法，如下所示：

```java
@Override
protected Result doInvoke(final Invocation invocation) throws Throwable {
        RpcInvocation inv = (RpcInvocation) invocation;
        final String methodName = RpcUtils.getMethodName(invocation);
        inv.setAttachment(Constants.PATH_KEY, getUrl().getPath());
        inv.setAttachment(Constants.VERSION_KEY, version);

        ExchangeClient currentClient;
        if (clients.length == 1) {
            currentClient = clients[0];
        } else {
            currentClient = clients[index.getAndIncrement() % clients.length];
        }
        try {
            boolean isAsync = RpcUtils.isAsync(getUrl(), invocation);
            boolean isOneway = RpcUtils.isOneway(getUrl(), invocation);
            int timeout = getUrl().getMethodParameter(methodName, Constants.TIMEOUT_KEY, Constants.DEFAULT_TIMEOUT);
            if (isOneway) { // 单向调用
                boolean isSent = getUrl().getMethodParameter(methodName, Constants.SENT_KEY, false);
                currentClient.send(inv, isSent);
                RpcContext.getContext().setFuture(null);
                return new RpcResult();
            } else if (isAsync) { // 异步调用
                ResponseFuture future = currentClient.request(inv, timeout);
                RpcContext.getContext().setFuture(new FutureAdapter<Object>(future));
                return new RpcResult();
            } else { // 同步调用
                RpcContext.getContext().setFuture(null);
                return (Result) currentClient.request(inv, timeout).get();
            }
        } catch (TimeoutException e) {
}
```

可以看到，Dubbo 的远程调用存在三种调用方式，即单向调用、异步无返回以及异步转同步。上述方法就包含了这三种调用方式的实现过程，而这些远程调用最终都是通过 ExchangeClient 进行完成。

在 Dubbo 提供的这三种远程调用方式中，异步转同步是默认的实现方式。接下来，我们重点对这一过程做具体展开。

### 服务调用异步转同步过程

在介绍 Dubbo 中异步转同步的服务调用方式之前，我们先围绕 JDK 中的 Future 模式讨论如何实现异步调用。

Future 模式是对传统调用模式的一种改进，它们之间的对比可以参考下图：

![](res/2024-10-28-18-30-33.png)

本质上，Future 模式为我们提供了一种无需等待的服务调用机制。当我们发起一次服务调用时，Future 机制可以直接返回并继续执行其他任务，而不是像传统调用模式那样一直需要等到调用方法的返回。

JDK 对 Future 模式提供了内置的实现，表现为如下所示的 Future 接口：

```java
public interface Future<V> {
   // 取消执行
   boolean cancel(boolean mayInterruptIfRunning);
   // 判断是否已取消
   boolean isCancelled();
   // 判断是否已完成
   boolean isDone();
   // 等待任务执行完毕并获取结果
   V get() throws InterruptedException, ExecutionException;
   // 基于一定的超时时间等待任务执行完毕并获取结果
   V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
}
```

Dubbo 中大量使用了基于 Future 机制的异步调用过程，同时也提供了异步转同步的实现机制，这是 Dubbo 提供的这三种远程调用方式中默认的实现方式。这部分内容实际上已经超出了服务引用的范围，而是更多偏向于讨论底层的网络通信，所以需要你对网络通信相关的内容先进行学习和掌握。

在 DubboInvoker 中 doInvoke 方法中，异步转同步过程的实现如下所示：

```java
RpcContext.getContext().setFuture(null);
return (Result) currentClient.request(inv, timeout).get();
```

我们先来看这里的 request 方法定义（位于 HeaderExchangeChannel 类中），如下所示：

```java
public ResponseFuture request(Object request, int timeout) throws RemotingException {
   Request req = new Request();
   req.setVersion("2.0.0");
   req.setTwoWay(true);
   req.setData(request);
   DefaultFuture future = new DefaultFuture(channel, req, timeout);
   try {
      channel.send(req);
   } catch (RemotingException e) {
      future.cancel();
      throw e;
   }
   return future;
}
```

请注意，这里用于发送请求的 channel.send 方法是异步执行的，也就说该方法一旦调用就会直接返回。为了实现“异步转同步”，Dubbo 在这里使用了 DefaultFuture 这个辅助类。请记住这个类，我们在后续内容中还会再次提到该类。

另一方面，我们在介绍网络通信时也提到，当请求到达服务器端时，在 NettyServer 中会使用一个 NettyHandler 作为网络事件的处理器，如下所示：

```java
pipeline.addLast("handler", nettyHandler);
```

NettyHandler 是一个接口，我们来看它的 messageReceived 方法实现，如下所示：

```java
private final ChannelHandler handler;

@Override
public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) throws Exception {
        NettyChannel channel = NettyChannel.getOrAddChannel(ctx.getChannel(), url, handler);
        try {
            handler.received(channel, e.getMessage());
        } finally {
            NettyChannel.removeChannelIfDisconnected(ctx.getChannel());
        }
}
```

这里把具体的处理逻辑转移到了 Dubbo 中自定义的 ChannelHandler 接口，这个接口有很多实现类，也包括 ChannelHandlerDelegate 这个代理类，而真正处理事件接收逻辑的 HeaderExchangeHandler 正是实现了这个代理类。HeaderExchangeHandler 中处理响应的实现过程如下所示：

```java
static void handleResponse(Channel channel, Response response) throws RemotingException {
        if (response != null && !response.isHeartbeat()) {
            DefaultFuture.received(channel, response);
        }
}
```

我们在这里再次看到了 DefaultFuture，这里的 DefaultFuture 就是前面客户端发送请求时用到的 DefaultFuture。DefaultFuture 的 received 方法中有进一步调用了如下所示的 doReceived 方法：

```java
private void doReceived(Response res) {
        lock.lock();
        try {
            // 设置响应 response 对象
            response = res;
            if (done != null) {
               // 唤醒阻塞的线程
               done.signal();
            }
        } finally {
            lock.unlock();
        }

        if (callback != null) {
            invokeCallback(callback);
        }
}
```

注意到这里的 done.signal 方法的执行效果会唤醒阻塞的线程，那么这个阻塞的线程在哪里的？显然，这时候我们应该回到客户端组件看看同步获取调用结果的入口。

我们再次回到在 DubboInvoker 中 doInvoke 方法中，看到了如下所示的核心代码：

```java
RpcContext.getContext().setFuture(null);
return (Result) currentClient.request(inv, timeout).get();
```

我们来具体看一下这个获取调用结果的 get 方法执行逻辑，如下所示：

```java
public Object get(int timeout) throws RemotingException {
        if (timeout <= 0) {
            timeout = Constants.DEFAULT_TIMEOUT;
        }
        if (!isDone()) {
            long start = System.currentTimeMillis();
            lock.lock();
            try {
                while (!isDone()) { // 当响应 response 对象为空
                    done.await(timeout, TimeUnit.MILLISECONDS);
                    if (isDone() || System.currentTimeMillis() - start > timeout) {
                        break;
                    }
                }
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
            if (!isDone()) {
                throw new TimeoutException(sent > 0, channel, getTimeoutMessage(false));
            }
        }
        return returnFromResponse();
}
```

可以看到，当响应 response 对象为空时，Condition 会执行 await 方法来阻塞当前线程，直到该线程被唤醒、被中断或超过阻塞时间。而在前面所述的 DefaultFuture 类的 doReceived 方法中，我们也看到会先为 response 赋上返回值，之后执行 Condition 的 signal 方法唤醒被阻塞的线程，这样 get 方法就会释放锁，进而执行 returnFromResponse 方法来返回值。

这样，整个远程调用的异步转同步过程就介绍完毕。作为总结，我们明确 Dubbo 异步转同步的原理其实就是利用 Lock 和 Condition 实现了等待通知机制。当客户端发送请求时，将一个请求 Id 和一个 DefaultFuture 对象包装在请求对象中。而当客户端异步收到响应时，则根据这个请求 Id 从响应结果中获取对应的 DefaultFuture 对象，并调用该 DefaultFuture 对象的 get 方法获取最终的调用结果。

## 解题要点

在涉及到远程调用的应用场景，很多开源框架都会基于 Future 或它的一些变种，例如 JDK 自身提供的改进版 CompleteFuture，或是 Google 的 guava 框架中提供的 ListenableFuture 等。类似的问题主要还是关注 Future 机制本身的一些特性，可以发散出一系列的问题，但基本的考点是一致的，回答的思路也类似。

Future 机制本身提供的几个接口也并不复杂，需要理解它们的含义和作用，但也要理解它们存在的不足。普通 Future 机制的最大问题在于没有提供通知的机制，也就是说我们不知道 Future 什么时候能够完成。前面提到的 CompleteFuture 和 ListenableFuture 实际上都是为了改进普通 Future 存在的这一问题而诞生的。本讲内容对 Future 的概念做了类比介绍，同时给出了 JDK 中 Future 接口的各个核心方法。通过掌握这些核心方法，针对这个问题我们就能拿到 60 分。如果我们还能够进一步分析基本 Future 机制的不足，然后引出 CompleteFuture 或 ListenableFuture 等改进版本的 Future，那么拿到 80 分就不成问题。

另一方面，对于 Dubbo 框架中的服务引用过程，我们需要重点掌握的是它的三种调用方式，即单向、同步和异步。其中前面两种比较好理解，而针对异步，我们在使用 Dubbo 的过程中实际上最终也是转换为同步操作。针对这一问题，如果只是回答这个问题中所提出的实现方式的种类，那么只要简单列举即可。但要说明具体的实现细节，尤其是 Dubbo 中 `异步转同步` 的实现细节，那么需要对本讲内容做深入的理解，并尝试使用自己的语言来总结整个过程。

## 小结与预告

承接上一讲内容，本讲围绕远程过程调用的服务引用过程展开了讨论。同样的，基于这套服务引用流程，我们也对 Dubbo 中服务引用的底层设计思想和实现过程进行了分析，尤其对服务调用异步转同步过程做了详细的阐述。

事实上，关于服务引用的完整介绍还没有结束。相较服务发布，服务引用还涉及到负载均衡、服务容错等技术组件，这些技术组件都是构建分布式服务所必不可少的。在接下来的几讲内容中，我们将一一对这些技术组件展开讨论。下一讲内容将先从负载均衡进行切入，在服务发布和引用的基础上回答这样一个问题：负载均衡如何与远程调用过程进行整合？我们下一讲详聊。

# 负载均衡：负载均衡如何与远程调用过程进行整合？

在上一讲中，我们详细阐述了在远程调用过程中服务引用的流程和实现方式。请注意，在现实环境中，我们一般都会采用集群模式对服务进行多实例化的部署，以防止出现单点故障。

那么，问题就来了，服务消费者的每一次远程调用就需要确定对这些服务实例中的具体哪一个发起请求，这就是负载均衡要解决的问题。

负载均衡（Load Balance）是一个复杂的话题，要想在远程调用过程中引入负载均衡，我们首先需要回答一个基本的问题，即：负载均衡是如何与远程调用过程进行整合的呢？本讲内容将围绕这一问题展开讨论。

## 问题背景

相信你对集群这个概念并不陌生。在分布式系统开发过程中，集群的作用主要有两点，一方面通过服务的冗余为系统可用性提供了一种技术手段，另一方面也针对系统的性能问题提供了解决方案。通过集群，我们能够将业务请求分摊到多台单机性能不一定非常出众的服务器上。这部分内容作为负载均衡的基本概念，是每位面试候选人都应该掌握的。

但是，如果问到“如何在远程调用中集成负载均衡机制”这个问题，就我的面试经验，相信很多候选人就不一定能回答出来了。从问题本身而言，你可能会觉得负载均衡和远程调用是天生整合在一起的，因为在日常开发过程中，开源框架以及运行时环境都已经帮你准备好了这部分工作，普通开发人员不需要参与，这也导致了我们对这部分内容不够重视。但是，就技术实现而言，两者之间的集成过程又非常重要。可以说，正是因为能够在远程调用过程中集成负载均衡机制，才会有我们后续要介绍的集群容错、服务熔断等一系列技术组件的应用。

进一步，我们来梳理针对这一话题的常见面试提问方式，包括：

- 负载均衡的基本结构是怎么样的，它有什么作用？
- 如果想要在远程调用过程中嵌入负载均衡机制，你有什么设计思路？
- 你能简要描述 Dubbo 框架的负载均衡组成结构吗？
- 在 Spring Cloud 中，为什么在 RestTemplate 类上添加了 @LoadBalanced 注解，就能自动集成负载均衡功能？

对于这类问题，我们注意到问题的要点并不在于负载均衡本身的概念和原理，而更多的是关于具体的实现过程和机制，所以是一种偏实战类的考查方式。

## 问题分析

在分布式系统构建过程中，势必需要引入负载均衡机制，而业界关于如何实现负载均衡存在一系列工具。在这些工具中，有些提供的是偏向于底层负载均衡算法实现的工具库，而有些则提供了整套负载均衡实现方案。无论是哪种类型，我们都需要获取想要访问的目标服务当前实例信息，这是实现远程调用和负载均衡进行整合的前提，也是我们在回答这类问题时的第一个要点。

回答这类问题的第二个要点在于，我们以什么样的技术手段完成在远程调用链路中自动嵌入负载均衡机制。从系统架构设计角度，这个嵌入过程应该对开发人员透明，且应该是可扩展的。在这点上，不同的实现框架有不同的策略，常见的包括两大类。

- 基于拦截机制：通过类似 AOP 的实现机制对请求进行拦截，再应用动态代理机制完成对负载均衡机制的嵌入。
- 基于集群机制：在集群构建过程中完成对负载均衡机制的嵌入。

最后，正如问题背景部分所阐述的，“如何在远程调用中集成负载均衡机制”这类话题考查的并不是概念，而是一种实践能力。我们通常不会自己去完成这个集成过程，但对于主流开源框架中的做法需要非常熟悉，否则很难从实现机制和过程上对这类问题进行解答。

## 技术体系

前面提到有两大类技术手段可以完成对远程调用和负载均衡的集成，事实上这也是 Spring Cloud 和 Dubbo 这两个主流分布式服务框架所采用的实现方式。本讲内容将讨论第一种，即拦截机制。关于集群机制的分析我们放在之后再展开。

如果我们采用拦截机制，那么整体的设计思想可以用下图进行展示：

![](res/2024-11-04-10-59-23.png)

上图所展示的基本思想在于：当我们采用拦截机制对远程方法进行拦截时，并不是直接执行该方法中的业务逻辑，而是嵌入自定义的一套负载均衡机制。这套负载均衡机制能够获取当前所有可用的服务实例信息，并基于一定策略确定目标服务实例。这个过程对开发人员是透明的。

现实中，采用这种实现机制的代表性框架就是 Spring Cloud。如果你使用过 Spring Cloud，那你应该知道想要在服务调用过程中嵌入负载均衡机制，要做的事情只有一件，就是在 RestTemplate 模板工具类上添加一个 @LoadBalanced 注解，如下所示：

```java
@LoadBalanced
@Bean
public RestTemplate getRestTemplate(){
     return new RestTemplate();
}
```

我们知道 RestTemplate 是 Spring 自带的一个 HTTP 请求工具类，本身并不具备负载均衡能力。讲到这里，你可能会觉得奇怪，为什么在这个工具类上添加了 @LoadBalanced 注解就能自动嵌入负载均衡机制呢？这个 @LoadBalanced 注解背后的工作原理又是怎么样的呢？为了回答这些问题，我们需要深入分析 Spring Cloud 的相关源码。

## 源码解析

让我们打开 Spring Cloud 源码，来到 spring-cloud-commons 这个代码工程，可以发现虽然这个工程的名称是 common，但内置了大量以 client 命名的代码包。这些代码包中就包含了与服务发现、负载均衡相关的所有基础类定义。我们要介绍的 @LoadBalanced 注解也位于这些代码包中。

接下来，让我们先从这个注解开始讲起。

### Spring Cloud 中的 @LoadBalanced

事实上，在 Spring Cloud 中维护着一个 RestTemplate 模板工具类的列表，而在该列表上就嵌入了 @LoadBalanced 注解，如下所示：

```java
@LoadBalanced
@Autowired(required = false)
private List<RestTemplate> restTemplates = Collections.emptyList();
```

上述代码位于自动配置类 LoadBalancerAutoConfiguration 中。针对这些被 @LoadBalanced 注解修饰的 RestTemplate，在 LoadBalancerAutoConfiguration 初始化的过程中会调用 RestTemplateCustomizer 的 customize 方法进行定制化，这个定制化的过程就是对目标 RestTemplate 增加拦截器 LoadBalancerInterceptor，如下所示：

```java
@Bean
@ConditionalOnMissingBean
public RestTemplateCustomizer restTemplateCustomizer(final LoadBalancerInterceptor loadBalancerInterceptor) {
       return restTemplate -> {
                List<ClientHttpRequestInterceptor> list = new ArrayList<>(restTemplate.getInterceptors());
                list.add(loadBalancerInterceptor);
                // 为 RestTemplate 添加拦截器
                restTemplate.setInterceptors(list);
       };
}
```

这里就用到了 RestTemplate 的拦截器扩展机制。通过这种机制，我们可以在 RestTemplate 发送请求的过程中添加定制化的功能。从命名上看，这里的 LoadBalancerInterceptor 就是添加了负载均衡的拦截器，我们在它的构造函数中发现传入了一个 LoadBalancerClient，而在它的拦截方法中本质上就是使用这个 LoadBalanceClient 来执行真正的负载均衡，如下所示：

```java
public class LoadBalancerInterceptor implements ClientHttpRequestInterceptor {
   // ...
   public LoadBalancerInterceptor(LoadBalancerClient loadBalancer) {
      this(loadBalancer, new LoadBalancerRequestFactory(loadBalancer));
   }

   @Override
   public ClientHttpResponse intercept(final HttpRequest request, final byte[] body, final ClientHttpRequestExecution execution) throws IOException {
      final URI originalUri = request.getURI();
      String serviceName = originalUri.getHost();

      // 通过 LoadBalancerClient 执行负载均衡
      return this.loadBalancer.execute(serviceName, requestFactory.createRequest(request, body, execution));
   }
}
```

这里的拦截方法 intercept 直接调用了 LoadBalancerClient 接口的 execute 方法完成对请求的负载均衡执行。而该方法的输入参数有两个，一个是代表服务名称的 serviceName，另一个则是代表负载均衡请求对象的 LoadBalancerRequest。而具体的 LoadBalancerRequest 则是如下所示的一个 ServiceRequestWrapper 包装类，如下所示：

```java
public class ServiceRequestWrapper extends HttpRequestWrapper {
   private final ServiceInstance instance;

   private final LoadBalancerClient loadBalancer;

   public ServiceRequestWrapper(HttpRequest request, ServiceInstance instance, LoadBalancerClient loadBalancer) {
      super(request);
      this.instance = instance;
      this.loadBalancer = loadBalancer;
   }

   @Override
   public URI getURI() {
      URI uri = this.loadBalancer.reconstructURI(this.instance, getRequest().getURI());
      return uri;
   }
}
```

可以看到，这里同样出现了 LoadBalanceClient，并用它来完成了请求地址 URI 的构建。显然，LoadBalanceClient 是我们分析负载均衡机制的核心入口。接下来，我们就对该接口及其实现类进行详细的展开。

### LoadBalanceClient 接口与实现类

LoadBalancerClient 是一个非常重要的接口，定义如下：

```java
public interface LoadBalancerClient extends ServiceInstanceChooser {
   // 执行负载均衡调用
   <T> T execute(String serviceId, LoadBalancerRequest<T> request) throws IOException;

   // 执行负载均衡调用
   <T> T execute(String serviceId, ServiceInstance serviceInstance, LoadBalancerRequest<T> request) throws IOException;

   // 构建负载均衡调用 URI
   URI reconstructURI(ServiceInstance instance, URI original);
}
```

注意到这里有两个 execute 重载方法，用于根据负载均衡器所确定的服务实例来执行服务调用。而 reconstructURI 方法 则用于构建服务 URI，基于负载均衡所选择的 ServiceInstance 信息，并利用服务实例的 host、port 以及端点路径，我们就可以构造出一个真正可供访问的服务地址。

同时，我们发现 LoadBalancerClient 有一个父接口 ServiceInstanceChooser，该接口定义如下：

```java
public interface ServiceInstanceChooser {
   // 根据 serviceId 选择目标服务实例
   ServiceInstance choose(String serviceId);

   // 根据 serviceId 和请求选择目标服务实例
   <T> ServiceInstance choose(String serviceId, Request<T> request);
}
```

显然，从负载均衡角度讲，我们应该重点关注实际上是这两个 choose 方法的实现，因为它们完成了对目标服务实例的具体选择过程，而这个选择过程集成了各种负载均衡算法。

在 Spring Cloud 中，LoadBalancerClient 接口有一组实现类。我们接下来要介绍的是 Spring Cloud Netflix 中的 RibbonLoadBalancerClient 类，该类基于 Netflix Ribbon 组件实现了负载均衡机制，是 Spring Cloud 中最早、也是最经典的一种负载均衡实现方式。

这里有必要梳理一下 Netflix Ribbon 和 Spring Cloud 之间的关系。我们知道 Netflix Ribbon 是来自 Netflix 的一个外部组件，它提供的只是一个辅助工具，这个辅助工具的目的就是让你去集成它，而不是说它自己完成所有的工作。而 Spring Cloud 中的 Spring Cloud Netflix Ribbon 专门针对 Netflix Ribbon 提供了一个独立的集成实现。对于 Netflix Ribbon 而言，Spring Cloud Netflix Ribbon 相当于它的客户端，而对于 Spring Cloud Netflix Ribbon 而言，我们的应用服务相当于它的客户端。

Netflix Ribbon、Spring Cloud Netflix Ribbon、应用服务这三者之间的关系以及核心入口如下图所示：

![](res/2024-11-04-11-02-11.png)

在 RibbonLoadBalancerClient 中，我们可以看到它的 choose 方法进一步调用了一个 getServer 方法来获取服务器信息，而这个 getServer 方法则是通过 ILoadBalancer 接口完成了对目标服务的选择，如下所示：

```java
public ServiceInstance choose(String serviceId, Object hint) {
   Server server = getServer(getLoadBalancer(serviceId), hint);
   // ...
}

protected Server getServer(ILoadBalancer loadBalancer, Object hint) {
   // ...
   return loadBalancer.chooseServer(hint != null ? hint : "default");
}
```

这个 ILoadBalancer 就来自于 Netflix Ribbon，该接口位于 com.netflix.loadbalancer 包下，定义如下：

```java
public interface ILoadBalancer {
   // 添加后端服务
   public void addServers(List<Server> newServers);

   // 选择一个后端服务
   public Server chooseServer(Object key);

   // 标记一个服务不可用
   public void markServerDown(Server server);

   // 获取当前可用的服务列表
   public List<Server> getReachableServers();

   // 获取所有后端服务列表
   public List<Server> getAllServers();
}
```

针对负载均衡，我们应该重点应该关注的是 ILoadBalancer 接口中 chooseServer 方法的实现，如下所示：

```java
public Server chooseServer(Object key) {
        if (counter == null) {
            counter = createCounter();
        }
        counter.increment();
        if (rule == null) {
            return null;
        } else {
            try {
                return rule.choose(key);
            } catch (Exception e) {
                 return null;
            }
        }
}
```

可以看到这里使用了一个 IRule 接口集成了具体负载均衡策略的实现。IRule 接口是对负载均衡策略的一种抽象，可以通过实现这个接口来提供各种负载均衡算法，该接口的类层结构如下图所示：

![](res/2024-11-04-11-03-24.png)

可以看到 Netflix Ribbon 中的负载均衡实现算法非常丰富，既提供了 RandomRule、RoundRobinRule 等无状态的静态算法，又实现了 AvailabilityFilteringRule、WeightedResponseTimeRule 等多种基于服务器运行状况进行实时路由的动态算法。关于这些负载均衡算法的讨论我们放在下一讲中。

在上图中还看到了 RetryRule 这种重试策略，该策略会对选定的负载均衡策略执行重试机制。严格意义上讲，重试是一种服务容错而不是负载均衡机制，但 Ribbon 也内置了这方面的功能。

事实上，我们也可以基于 IRule 接口实现任何定制化的负载均衡算法，然后通过配置的方式加载到 Spring Cloud 中，示例代码如下所示：

```java
@Configuration
public class LoadBalanceConfig{

    @Autowired
    IClientConfig config;

    @Bean
    @ConditionalOnMissingBean
    public IRule customRule(IClientConfig config) {

        return new RandomRule();
    }
}
```

显然该配置类的作用是使用 RandomRule 替换 Ribbon 中的默认负载均衡策略 RoundRobin。

## 解题要点

关于负载均衡和远程调用的整合过程是一道经典的面试题，理论知识和工程实践都有涉及，我经常拿这道题来考察候选人。就考查内容而言，这道题所涵盖的知识面要求很广，需要面试者对负载均衡、远程调用以及主流的分布式服务框架本身的功能特性都有一定的了解。

而从提问方式上讲，这个面试主题往往会直接从具体的工具框架的特性进行切入，考查面试者对框架原理的理解，正如本讲中重点介绍的 Spring Cloud 和 @LoadBalanced 注解。乍一看，这类面试题感觉无从下手，因为 @LoadBalanced 注解在使用过程中并没有提供太多的配置项供开发人员进行设置，我们也就很难联想到其背后所具备的负载均衡机制。

但事实上，在这个注解背后隐藏着一个很重要的技术组件，即拦截器。通过在某一个注解中添加拦截功能，然后把一些非功能性需求通过拦截器进行实现，这是 Spring 等优秀开源框架中所经常使用的一种开发技巧，也是面试官考查面试者对开源框架理解能力的一个常见维度。在回答这道面试题时，我们就需要从拦截器的角度出发，把 RestTemplate 和 Ribbon 组件结合起来进行分析。至于负载均衡算法本身，反而不是这道面试题考查的重点，我们只要点到即可。

## 小结与预告

通过今天内容的介绍，我们明确作为一款负载均衡工具，要做的事情无非是从服务列表中选择一个服务进行调用。为了实现这个过程，我们需要提供入口供客户端请求进行使用。而 Spring Cloud 为我们提供了一种非常友好的实现方式，开发人员只需要通过一个简单的 @LoadBalanced 注解就能自动在调用过程中集成负载均衡机制。今天的内容对 @LoadBalanced 注解以及背后的整个负载均衡实现流程做了原理分析。通过这种方式，我们也加深了对“如何在远程调用中集成负载均衡机制”这个问题的理解程度。

在前面的内容中，我们已经看到 Spring Cloud 内置了一组丰富的负载均衡算法，而这些负载均衡算法能够根据需要帮助我们自动找到最佳的目标服务。事实上，任何一款分布式服务框架都提供了各种不同类型的负载均衡算法供开发人员进行选择。那么，如何实现这些常见的负载均衡算法？这就是下一讲要讨论的内容。

# 负载均衡：如何实现常见的负载均衡算法？

上一讲我们分析了在远程调用过程中整合负载均衡机制的实现过程。在这种场景下，我们将多个服务实例集中在一起，每一次请求都可以由集群中的某一个服务实例进行响应。

那么，具体某一个请求到底应该是由哪个服务实例来响应最为合适呢？这个话题看上去很简单，实际上却有点复杂，涉及到服务请求的路由机制。

而在分布式系统中，上一讲中引入的负载均衡就是最常见也是最具代表性的一种路由机制。为了对请求进行合理的分发，我们需要提供一组负载均衡算法，那么常见的负载均衡算法有哪些？它们又应该如何实现呢？这是一道非常典型的面试题，本讲内容将围绕这一主题展开讨论。

## 问题背景

我们先来看这个问题背后的示意图，如下图所示：

![](res/2024-11-05-10-38-28.png)

显然，我们需要明确从服务 B 发出的请求最终会由服务 A 所提供的具体哪一个实例来进行处理，这是负载均衡算法的作用。上图所示的基本架构虽然简单，但围绕该图，我们可以延伸出一系列的扩展性话题，包括：

- 负载均衡算法应该位于上图中的哪个位置？是在服务 B 中，还是应该有专门存储这些算法的其他组件？
- 服务 A 的某个实例如果出现了问题，服务 B 还能对它进行访问吗？
- 服务 A 各个实例的当前负载肯定不一样，服务 B 基于什么原则选择最合适的目标实例呢？
- 如何防止对服务 A 实例的访问过程是不均衡的，从而导致服务 A 的某个实例压力太大？

这些扩展性话题才是面试官想要真正考查的知识点，而对于这些知识点的掌握程度也体现了你和其他候选人之间的水平差异。

我们可以沿着面试官的考查思路，梳理一组与负载均衡算法相关的一组常见面试题，包括：

- 从你自己所理解的角度出发，你认为负载均衡算法可以分成哪些类型？
- 如果想要在常见的静态负载均衡算法中嵌入动态特性，你有什么思路？
- 你能列举常见的负载均衡算法以及它们的特性吗？
- Dubbo 包含了哪些负载均衡算法？
- Spring Cloud 内置了哪些负载均衡算法？
- Dubbo 框架在实现负载均衡机制时提供了哪些优化特性？
- 一致性哈希算法的实现过程是怎么样的？

可以看到，针对负载均衡算法的提问形式灵活多样。面试官既可以考查一些基本概念，也可以抛出一些发散性问题。同时，针对具体框架中负载均衡算法的实现方式也会经常出现在面试题中。

## 问题分析

对于上述问题而言，我认为回答的思路还是比较明确的，主要就是对主流负载均衡算法需要有全面的了解。这部分属于理论知识，考查方式比较固定，很难有创新和变化，应对策略上主要以记忆为主。相比到目前为止我们已经介绍的各讲内容，可以说，针对负载均衡算法的回答方式是最直接的。

然后，无论你现在使用的是哪种分布式服务框架，都需要把它与常见的负载均衡算法结合起来进行掌握。在面试过程中，你可以基于自己擅长的框架来分析具体的算法实现过程。同时，很多时候我们也需要结合上一讲中讨论的话题，把负载均衡算法与远程调用过程结合起来一起讨论。

## 技术体系

在进行具体的工具介绍和源码分析之前，我们首先对负载均衡的类型以及相应的基本策略做简要介绍。

### 负载均衡的类型

负载均衡主要包括服务器端负载均衡和客户器端负载均衡两大类。我们先来看服务器端负载均衡，它的结构如下图所示：

![](res/2024-11-05-10-40-18.png)

可以看到，所谓的服务器端负载均衡指的就是在客户端和各个服务实例之间存在一个独立的负载均衡器，所有的请求都将通过这个负载均衡器进行转发并嵌入负载均衡算法。业界关于这种负载均衡器的实现工具也很多，最常见的就是 Nginx。

我们换一种思路，把上图中负载均衡器所具备的功能放到客户端中，那么就诞生了另一种负载均衡机制，即客户端负载均衡。这时候，负载均衡算法的执行流程发生在客户端本地，如下图所示：

![](res/2024-11-05-10-40-53.png)

客户端负载均衡应用广泛，例如目前主流的微服务架构实现框架 Spring Cloud、Dubbo 等都内置了完整的客户端负载均衡模块。而像老牌的分布式缓存 Memcache 同样也是这一负载均衡策略的典型应用。

我们来对上述这两种负载均衡机制做一个对比，会发现客户端负载均衡不需要架设专门的服务器组件，负载均衡算法的执行过程被分摊到了每个客户端内部，不会造成明显的单点瓶颈。当然，因为每个客户端自己都需要维护一套服务实例信息，所以需要确保服务实例的变更能够及时通知到各个客户端。

### 负载均衡算法和策略

无论使用哪种负载均衡机制，负载均衡算法决定了最终的请求分发效果。常见的负载均衡算法也可以分成两大类，即静态负载均衡算法和动态负载均衡算法。

#### 静态负载均衡

对于静态负载均衡而言，经典的算法包括各种随机（Random）和轮询（Round Robin）算法。

1. 随机算法

   随机算法是最简单也是最常用的负载均衡算法之一，该算法就是使用一个随机数来决定具体的目标服务实例。

   假设我们持有一个保存所有服务的 serverList 列表，那么只用 JDK 中自带的 Random 工具类就可以实现一个基本的随机算法，如下所示：

   ```java
   java.util.Random random = new java.util.Random();
   int randomPosition = random.nextInt(serverList.size());
   return serverList.get(randomPosition);
   ```

   随机算法足够简单，但有时候并不能满足我们的需求。例如，如果在集群中存在一些性能有差异的服务器，为了充分利用那些高性能的服务器，可以提升这些服务器的访问权重，这时候就可以引入用加权随机（Weight Random）算法。

   假设存在一个 serverWeightMap 保存着服务器地址与权重之间的对应关系，类似 `("192.168.10.100", 1)`、`("192.168.10.105", 3)` 这样的结构，那么实现加权随机的一种简单策略就是构建一个新的 serverList 列表，并根据服务权重的数量来添加重复数量的服务提供者地址（这样权重越高的服务被选中的概率就会越大），然后再使用随机算法进行选择，示例代码如下所示：

   ```java
   Set<String> keySet = serverWeightMap.keySet();
   Iterator<String> iterator = keySet.iterator();
   List<String> serverList = new ArrayList<String>();
   while (iterator.hasNext()) {
      String server = iterator.next();
      int weight = serverWeightMap.get(server);
      for (int i = 0; i < weight; i++) {
         serverList.add(server);
      }
   }

   java.util.Random random = new java.util.Random();
   int randomPosition = random.nextInt(serverList.size());
   return serverList.get(randomPosition);
   ```

2. 轮询算法

   所谓轮询，就是一个循环访问所有服务器列表的过程。在循环过程中，如果发现某台服务器可用就把请求分发给它。如果一个循环下来还是没有找到合适的服务器，那么就继续进行新的一轮循环，直到找到目标服务器。

   轮询算法的一种简单的实现方法如下所示：

   ```java
   String server = null;
   synchronized(position) {
      if (position > serverList.size()) {
         position = 0;
      }

      server = serverList.get(position);
      position++;
   }

   return server;
   ```

   类似加权随机算法，我们也可以实现加权轮循（Weighted Round Robin）算法。

#### 动态负载均衡算法

对于负载均衡算法而言，权重本质上也是一个可以动态变化的参数，所以也可以基于权重构建动态负载均衡算法。

典型的动态负载均衡算法实现过程都没有那么简单，常见的包括最少连接数算法、源 IP 哈希算法、服务调用时延算法等。

1. 最少连接数算法

   所谓最少连接数（Least Connection）算法，就是根据当前服务器的连接数量来决定目标服务器。在系统运行过程中，连接数显然是一个不断在变化的参数，我们可以选择那些连接数较少的服务来接收新的请求。

   因此，当执行分发策略时，我们会根据在某一个特定的时间点下服务实例的最新连接数来判断是否执行客户端请求。而在下一个时间点时，服务实例的连接数一般都会发生相应的变化，对应的请求处理也会做相应的调整。

2. 源 IP 哈希算法

   在日常开发过程中，有时候我们希望实现这样一种分发效果：来自同一个客户端的请求总是发送到某一个固定的服务器，这时候就可以引入源 IP 哈希（Source IP Hash）算法，该算法会根据请求的 IP 地址来决定目标服务器。只要源 IP 地址不变，那么负载均衡的结果也是固定的。

   源 IP 哈希算法一种实现方案如下所示：

   ```java
   String remoteIp = getRemoteIp();
   int hashCode = remoteIp.hashCode();
   int serverListSize = serverList.size();
   int serverPos = hashCode % serverListSize;
   return serverList.get(serverPos);
   ```

3. 服务调用时延算法

   服务调用时延（Service Invoke Delay）算法的动态性来自于服务的调用延迟。针对每一台服务器，我们都可以计算一段时间内所有请求的服务调用时延。有了这个参数之后，就可以执行各种计算策略进一步决定选择哪一台服务器来对请求做出响应。

针对前面介绍的各个负载均衡算法，我们可以通过如下所示的一张思维导图来进行总结：

![](res/2024-11-05-10-48-23.png)

## 源码解析

有了理论知识，我们接下来讨论负载均衡的实际应用。诸如最少连接数算法、服务调用时延算法等动态负载均衡算法在设计和实现上都比较复杂，我们重点来看一下主流开源框架中对它们的实现机制。在接下来的内容，我们以 Dubbo 框架为例展开讨论。

### Dubbo 负载均衡整体结构

在 Dubbo 中，专门提供了一个 LoadBalance 接口来提供负载均衡能力，如下所示：

```java
@SPI(RandomLoadBalance.NAME)
public interface LoadBalance {
    @Adaptive("loadbalance")
    <T> Invoker<T> select(List<Invoker<T>> invokers, URL url, Invocation invocation) throws RpcException;
}
```

可以看到 LoadBalance 接口只有一个方法，即在一批 Invoker 列表中选择其中一个 Invoker 进行返回。这里，我们可以从该接口上的 `@SPI(RandomLoadBalance.NAME)` 注解中看到 Dubbo 默认加载的是 RandomLoadBalance 类，即随机负载均衡。除了 RandomLoadBalance 类之外，Dubbo 还提供了其他多种负载均衡策略，整体的类层结构如下图所示：

![](res/2024-11-05-10-49-27.png)

从上图中，我们看到存在一个 AbstractLoadBalance 抽象类，它实现了 LoadBalance 的 select 方法，如下所示：

```java
public <T> Invoker<T> select(List<Invoker<T>> invokers, URL url, Invocation invocation) {
   if (invokers == null || invokers.size() == 0)
      return null;
   if (invokers.size() == 1)
      return invokers.get(0);
   return doSelect(invokers, url, invocation);
}
```

显然，从设计模式上讲，这里采用的是经典的模板方法。通过模板方法，具体负载均衡算法由 AbstractLoadBalance 子类中的 doSelect 方法进行实现。

同时，我们在 AbstractLoadBalance 中还看到了如下所示的 getWeight 方法。从方法命名上看，该方法用来计算权重，如下所示：

```java
protected int getWeight(Invoker<?> invoker, Invocation invocation) {
   // 从 URL 中获取权重
   int weight = invoker.getUrl().getMethodParameter(invocation.getMethodName(), Constants.WEIGHT_KEY, Constants.DEFAULT_WEIGHT);
   if (weight > 0) {
      long timestamp = invoker.getUrl().getParameter(Constants.REMOTE_TIMESTAMP_KEY, 0L);
      if (timestamp > 0L) {
         int uptime = (int) (System.currentTimeMillis() - timestamp);
         // 从 URL 中获取预热时间
         int warmup = invoker.getUrl().getParameter(Constants.WARMUP_KEY, Constants.DEFAULT_WARMUP);
         if (uptime > 0 && uptime < warmup) {
            // 计算预热权重
            weight = calculateWarmupWeight(uptime, warmup, weight);
         }
      }
   }
   return weight;
}
```

可以看到代表权重的 weight 参数是从 URL 中传入的。而基于上述代码，我们发现这里的处理逻辑显然并没有那么简单，而是用到了所谓的预热（Warmup）机制。我们看到 Dubbo 首先会获取服务启动时间，然后再与预热时间进行比较。如果启动时间小于预热时间，则会调用 calculateWarmupWeight 方法来重新计算预热权重。

从代码逻辑上看，预热权重最小为 1，并在预热时间内随启动时间逐渐增加。这样设计的原因在于：JVM 从启动成功到处于最佳状态需要一段时间，在这段时间内虽然服务可以接收请求，但显然不应该接收过多请求。所以，Dubbo 通过预热机制确保在预热时间内该服务受到一定的保护，直到其处于最佳运行状态。

预热机制在 Dubbo 的多个负载均衡算法中都得到了应用，是一种实现上的技巧，为我们设计类似的应用场景提供了一定的参考价值。

### Dubbo 负载均衡算法实现示例

接下来，就让我们看看 Dubbo 中使用预热机制的场景和方式。我们重点介绍 LeastActiveLoadBalance 类，这是一种典型的动态负载均衡算法。

LeastActiveLoadBalance 继承自 AbstractLoadBalance 类，并实现了如下所示的 doSelect 方法。该方法比较长，我们对代码进行了部分裁剪。

```java
@Override
protected <T> Invoker<T> doSelect(List<Invoker<T>> invokers, URL url, Invocation invocation) {
   // 获取所有的 invoker 并执行计算
   for (int i = 0; i < length; i++) {
      Invoker<T> invoker = invokers.get(i);
      // 通过 RpcStatus 获取当前这个 invoker 并发数
      int active = RpcStatus.getStatus(invoker.getUrl(), invocation.getMethodName()).getActive();
      // 通过预热机制计算权重值
      int afterWarmup = getWeight(invoker, invocation);

      // 发现最小的活跃数，重新开始计算
      if (leastActive == -1 || active < leastActive) {
         // 记录 leastActive 为当前的活跃数，并重置最小计数，基于当前最小计数重新计数
         // …
      } else if (active == leastActive) {
         // 当前 invoker 的活跃数与最小活跃数相等,则记录权重
         // …
      }
   }

   // 如果我们恰好有一个调用程序具有最少的活动值，那么直接返回这个调用程序
   if (leastCount == 1) {
      return invokers.get(leastIndexs[0]);
   }

   // 如果每个 invoker 有不同的权重
   if (!sameWeight && totalWeight > 0) {
      // 在总权重范围内随机一个值
      int offsetWeight = random.nextInt(totalWeight) + 1;
      for (int i = 0; i < leastCount; i++) {
            // 获取 i 位置的那个最小活跃在 invokers 里面的位置信息
            int leastIndex = leastIndexs[i];
            offsetWeight -= getWeight(invokers.get(leastIndex), invocation);
            if (offsetWeight <= 0) {
               // 返回这个位置
               return invokers.get(leastIndex);
            }

      }
   }

   // 具有相同权重或者是总权重 = 0 的话就均匀返回
   return invokers.get(leastIndexs[random.nextInt(leastCount)]);
}
```

在上述代码中，我们对关键流程添加了注释。该算法首先会对所有的 Invoker 进行轮询，找出所有活跃数最小的集合。如果这个集合的数量只有 1，那么就可以直接返回当前的 Invoker。如果集合中所有 Invoker 的权重相同，那么随机返回一个。而如果这些条件都不满足，那么就获取一个具有最小活跃数的 Invoker。

为了实现扩展性，Dubbo 提供了 SPI 机制，允许开发人员自定义负载均衡算法，我们会在后面介绍微内核架构和 SPI 机制时给出一个简单的案例。你也可以根据自己的需要尝试实现新的负载均衡算法。

## 解题要点

在分布式系统面试中，负载均衡是一道高频面试题。针对常见的负载均衡算法以及它们的特性，面试官考查的是候选人对分布式系统基本概念的理解。因为负载均衡的各种算法以及特性相对固定，所以这类题的考点是非常明确的。

在回答这类面试题时，需要把握两点。首先，我们要介绍负载均衡算法的分类，即静态负载均衡和动态负载均衡。其次，我们需要列举常见负载均衡算法，并基于自己的理解分析这些算法的功能特性。针对随机、轮询等静态负载均衡算法，我们的回答思路是给出基本的设计策略和所能达到的效果，以及如何将这些静态负载均衡算法转换为动态负载均衡算法的实现方法。因为静态负载均衡算法相对都比较简单，所以这部分内容不是回答的重点。我们需要详细介绍的是一致性哈希、最少连接数等动态负载均衡的实现原理。

另一方面，关于负载均衡算法的考查，基于具体开源框架内部的实现细节进行提问也是另一种比较常见的方式。例如，如果被问到类似 `Dubbo 框架在实现负载均衡机制时提供了哪些优化特性？` 这样的问题，回答起来是有难度的，因为它考查的并不仅仅是对 Dubbo 中所提供的负载均衡算法的描述，而更多的是问到了框架的底层设计思想和实现原理，需要面试者对 Dubbo 的源码有较深程度的理解，并能抓住细节。在回答上，就需要提到 Dubbo 中的“预热”机制，该机制的目的是确保服务在刚启动的一段时间内得到保护，避免因为负载均衡导致出现不可用的情况。在回答这道题时，这些内容背后的设计思想都应该被介绍到。

## 小结与预告

本讲内容梳理了分布式系统开发过程中所采用的负载均衡算法。在 Spring Cloud 中所实现的核心负载均衡算法包括随机、轮询、加权响应时间、并发量最小优先等，而 Dubbo 中则提供了随机、轮询、最少活跃调用数和一致性哈希等算法。可以看到，这两个框架在实现主流算法的同时，也根据框架自身的特点提供了一些比较有特色的策略。当然，这两个框架也都内置了扩展入口供开发人员实现自定义的负载均衡算法。

在介绍完负载均衡之后，我们接下来要进入到“服务容错”这一技术组件的讨论。服务容错的实现方式有很多，其中集群的构建为容错机制提供了天然的基础。那么，什么是集群容错？现实中又有哪些常见的集群容错策略呢？下一讲将对这些问题展开详细的分析。

# 服务容错：什么是集群容错？有哪些集群容错策略？

在前面两讲内容中，我们对远程过程调用中的负载均衡机制进行了详细的讨论。而在介绍负载均衡的实现策略时，我们也提到了集群这一概念。集群的构建一方面能够为实现负载均衡提供基础，另一方面，它也能够有效应对服务访问出错的场景，这就是集群容错。

在分布式系统运行过程中，远程调用发生失败的现象不可避免。为了应对服务访问失败，集群容错是一种简单高效的技术组件。

那么，什么是集群容错？常见的又有哪些集群容错策略呢？这一话题也是分布式服务相关的一道高频面试题，本讲内容将对这一主题展开全面的讨论。

## 问题背景

在分布式系统中，对于服务提供者和消费者而言实际上存在一种依赖关系。一方面，每个服务自身可能会发生异常情况，更为重要的，这种依赖关系会导致系统中的其他服务也发生调用失败，如下图所示：

![](res/2024-11-06-11-05-17.png)

那么问题就来了，一旦出现上图中的失败场景，我们有什么应对策略呢？这是开发任何一个分布式系统必须要考虑的问题，也是面试官非常喜欢考查的一个问题。

就技术体系而言，我们可以把应对远程调用失败场景的各种手段和方法统称为服务容错（Fault Tolerance），而集群容错是服务容错的其中一种实现方式。我们知道，所谓集群，就是同时存在一个服务的多个实例。一旦我们访问其中一个实例出现问题，原则上可以访问其他实例来获取结果。

围绕这个过程，技术上有很多值得面试官考查的点，包括：

- 如何判断集群中当前有哪些服务实例是不可用的？
- 如果某一个服务实例不可用，选择下一个服务实例的策略有哪些？
- 如果访问所选择的下一个服务实例仍然失败，我们应该怎么做？
- 为了快速判断集群中某个服务是否存在可用的示例，有什么办法？

当然，和负载均衡一样，主流的分布式服务框架也都内置了集群容错机制。例如 Dubbo 框架就包含一组非常常用的集群容错实现策略。在面试过程中，针对具体框架中集群容错的底层实现原理进行讨论的场景并不少见。

## 问题分析

对于集群容错，我们首先还是有必要分析远程调用发生依赖失败的影响，或者说我们需要引入集群容错机制的原因，这里就引出一个非常适合作为面试话题来展开的概念，即 `雪崩效应（Avalanche Effect）`。雪崩效应是我们引入容错思想和模式的根本需求。以我的面试经历而言，雪崩效应在分布式系统相关面试场景中出现的频次比较高，在介绍具体容错机制之前，先来对这个概念进行展开有助于提升候选人给到面试官的第一印象。

回答这一问题的第二个要点是对集群容错的各种实现策略的详细分析。这部分内容属于理论知识体系，需要进行记忆。幸好常见的集群容错实现策略并不是很多，因此掌握起来并不困难。

最后，我们还是需要理论联系实际。集群容错的几种代表性实现策略在 Dubbo 等主流的开源框架都有体现。在面对面试官时，基于具体的框架底层实现原理来展示自己对集群容错机制的掌握程度无疑是一种加分项。

## 技术体系

正如前面提到的，服务依赖失败是我们在设计分布式系统时所需要重点考虑的服务可用性问题，因为服务依赖失败会造成失败扩散，从而形成服务访问的雪崩效应。让我们先从这个过程开始讲起。

### 雪崩效应

下图展示了雪崩效应的示意图，可以看到 A、B、C、D、E 这 5 个服务存在依赖关系，服务 A 为服务提供者，服务 B 为服务 A 的消费者，服务 C、D 和 E 则是服务 B 的消费者。现在，假如服务 A 变成不可用，就会引起服务 B 的不可用，并将这种不可用性逐渐扩散到服务 C、D 和 E 时, 从而造成了整个服务体系发生雪崩。

![](res/2024-11-06-11-08-28.png)

服务雪崩的产生是一种扩散效应，我们可以对上图中的现象进行剥离，先从服务 A 和服务 B 这两个服务之间的交互进行切入。下图展示了雪崩效应产生的三个阶段，即首先服务提供者 A 发生不可用，然后服务消费者 B 不断进行重试加大了访问流量，最后导致服务 B 自身也不可用。

![](res/2024-11-06-11-09-11.png)

在上图中，通过用户不断提交服务请求或代码逻辑自动重试等手段，服务 B 会进一步加大对服务 A 的访问流量。因为服务 B 使用同步调用，会产生大量的等待线程占用系统资源。一旦线程资源被耗尽，服务 B 本身也将处于不可用状态。这一过程在整个服务访问链路上进行扩散，就形成了雪崩效应。

显然，应对雪崩效应的切入点不在于服务提供者，而在于服务消费者。我们不能保证所有服务提供者都不会失败，但是我们要想办法确保服务消费者不受已失败的服务提供者的影响，或者说需要将服务消费者所受到的这种影响降到最低，这就是服务容错的本质需求。而集群容错可以很好地应对这一需求。

### 集群容错的策略

在上一讲中，我们已经介绍了集群和客户端负载均衡，从服务容错的角度讲，负载均衡不失为是一种可行的容错策略。而我们今天要介绍的集群容错则是在负载均衡的基础上添加了各种容错策略，包括常见的 Failover（失效转移）、Failback（失败通知）、Failsafe（失败安全）和 Failfast（快速失败） 以及不大常见的 Forking（分支）和 Broadcast（广播） 等。我们一一来看一下。

Failover 是最常见、最实用的集群容错策略。Failover 即失效转移，当发生服务调用异常时，重新在集群中查找下一个可用的服务实例。为了防止无限重试，通常对失败重试最大次数进行限制，如下图所示：

![](res/2024-11-06-11-11-24.png)

相较 Failover，Failback 则采用了不同的实现方式，它会记录每一次失败的请求，然后再基于一定的策略执行重试操作。显然，这种容错策略适合于那种时效性不高的操作，常见的包括发送短信等消息通知类业务。

Failsafe 的意思是失败安全，该策略并不会对所发生的异常做直接的干预，而是将它们记录下来，确保后续可以根据日志记录找到引起异常的原因并解决。

还有一种比较容易混淆的策略称为 Failfast，该策略在获取服务调用异常时立即报错。显然，Failfast 已经彻底放弃了重试机制，等同于没有容错，一般用于非幂等性的写入操作。另一方面，在特定场景中可以使用该策略确保非核心业务服务只调用一次，为重要的核心服务节约宝贵时间。

以上三种集群容错策略之间的区别可以参考下图：

![](res/2024-11-06-11-12-01.png)

除了这些常见的集群容错机制之外，在一些分布式服务框架中，还实现了一些特殊的策略，例如提供分支调用机制的 Forking 策略和提供广播机制的 Broadcast 策略。这些策略的使用场景比较少，这里不做具体展开。

## 源码解析

### Dubbo 中的集群

服务容错的实现方法和策略有很多，我们接下来重点讨论 Dubbo 中主要采用的集群容错实现策略和底层原理。

Dubbo 中的整个集群结构如下图所示。这张图比较复杂，涉及到 Dubbo 中关于集群管理和服务调用的诸多概念。为了讨论集群容错，我们必须首先理解这种图中的相关概念，进而把握 Dubbo 对集群的抽象。

![](res/2024-11-06-11-12-46.png)

上图展现了 Dubbo 中的几个重要技术组件，我们一一来展开。

- Invoker：在 Dubbo 中，Invoker 是一个核心概念，代表的就是一个具体的可执行对象。
- Directory：即目录，代表一个集合，内部包含了一组 Invoker 对象。
- Router：即路由器，根据路由规则在一组 Invoker 中选出符合规则的一部分 Invoker。
- LoadBalance：即负载均衡，对经过 Router 过滤之后的一部分 Invoker 执行各种负载均衡算法，从而确定一个具体的 Invoker。
- Cluster：即集群，从 Directory 中获取一组 Invoker，并对外伪装成一个 Invoker。这样，我们在使用 Cluster 时就像是在使用一个 Invoker 一样，而在这背后则隐藏了容错机制。

基于上述分析，今天内容所要介绍的重点是 Cluster。我们首先来看看 Dubbo 中 Cluster 接口的定义，该接口只包含一个 join 方法，如下所示：

```java
@SPI(FailoverCluster.NAME)
public interface Cluster {
    @Adaptive
    <T> Invoker<T> join(Directory<T> directory) throws RpcException;
}
```

Cluster 接口中包含另一个与集群相关的重要概念，即前面提到的 Directory。Directory 本质上代表多个 Invoker，我们需要知道可以通过它获取一个有效 Invoker 的列表。

换一个角度，Dubbo 中的 Cluster 也相当于是一种代理对象，它在 Directory 的基础上向开发人员暴露一个具体的 Invoker，而在暴露这个 Invoker 的过程中，万一发生了异常情况，Cluster 就会自动嵌入集群容错机制。那么，Cluster 是如何做到这一点的呢？

在 Dubbo 中，实际上提供了一组不同类型的 Cluster 对象，而每一个 Cluster 对象就代表着一种具体的集群容错机制，如下图所示：

![](res/2024-11-06-11-15-16.png)

上述方案中，Dubbo 默认使用的是 FailoverCluster。我们来看一下这个默认实现，如下所示：

```java
public class FailoverCluster implements Cluster {
    public final static String NAME = "failover";

    public <T> Invoker<T> join(Directory<T> directory) throws RpcException {
        return new FailoverClusterInvoker<T>(directory);
    }
}
```

可以看到该类非常简单，join 方法只是根据传入的 Directory 构建一个新的 FailoverClusterInvoker 实例。而查看其他的 Cluster 接口实现，可以发现它们的处理方式与 FailoverCluster 类似，都是返回一个新的 Invoker。

### Dubbo 中的集群容错机制

显然，想要理解 Dubbo 中的集群容错机制，重点是要分析上图中所示的各种 ClusterInvoker 对象。

这里，我们同样选择默认的 FailoverClusterInvoker 作为分析入口。在深入 FailoverClusterInvoker 之前，我们发现该类存在一个基类，即 AbstractClusterInvoker，而 AbstractClusterInvoker 又实现了 Invoker 接口，它们之间的关系如下图所示：

![](res/2024-11-06-11-16-27.png)

从设计模式角度讲，AbstractClusterInvoker 采用的是很典型的模板方法设计模式。模板方法设计模式的一般实现过程就是为整个操作流程提供一种框架代码，然后再提取抽象方法供子类进行实现。上图中就展示了模板方法的设计思想。

AbstractClusterInvoker 的实现逻辑也是类似，它的主要步骤包括从 Directory 获得 Invoker 列表、基于 LoadBalance 实现负载均衡，并基于 doInvoke 方法完成在远程调用中嵌入容错机制。

这里的 doInvoke 就是模板方法，需要 FailoverClusterInvoker 等子类分别实现，如下所示：

```java
public abstract class AbstractClusterInvoker<T> implements ClusterInvoker<T> {
    protected abstract Result doInvoke(Invocation invocation, List<Invoker<T>> invokers,  LoadBalance loadbalance) throws RpcException;
}
```

AbstractClusterInvoker 类的代码有点长，但理解起来并不是很复杂。通过观察该类中的代码实现，可以看到存在一批以 select 结尾的方法，包括 select、doselect、reselect 以及 LoadBalance 本身的 select 方法。我们基于这些 select 方法梳理整体的处理流程，并给出如下所示的伪代码：

```java
select() {
   checkSticky(); // 粘滞连接

   doselect() {
      loadbalance.select();

      reselect() {
         loadbalance.select();
      }
   }
}
```

上述伪代码清晰展示了这些 select 方法的嵌套过程，从而能够更好地帮助你梳理代码执行流程。

首先，select 方法的第一部分内容提供了 `粘滞连接` 机制。所谓粘滞连接（Sticky Connection），就是为每一次请求维护一个状态，确保始终由同一个服务提供者对来自同一客户端的请求进行响应。这点和我们在上一讲中提到的源 IP 哈希负载均衡算法比较类似，你可以做一些回顾。在 Dubbo 中，使用粘滞连接的目的是减少重复创建连接的成本，提高远程调用的效率。我们可以通过 URL 传入的 sticky 参数对该行为进行控制。

处理完粘滞连接之后，select 方法就借助于 doselect 方法执行下一步操作。doselect 方法执行了一系列的判断来最终明确目标 Invoker 对象。首先，我们需要判断当前是否存在可用的 Invoker 对象，如果没有则直接返回。如果有，那么就分如下几种情况：

- 如果只有一个 Invoker 对象，那么该 Invoker 对象就是目标 Invoker 对象；
- 如果有两个 Invoker 对象，则使用轮询机制选择其中一个进行返回；
- 如果有两个以上的 Invoker 对象，这时候就会借助于 LoadBalance 的 select 方法，通过负载均衡算法来最终确定一个目标 Invoker 对象。

下图展示了这个执行过程：

![](res/2024-11-06-11-18-19.png)

在获取了目标 Invoker 对象之后，Dubbo 并不会直接就使用这个对象，因为我们需要考虑该对象的可用性。如果该 Invoker 对象不可用或者已经使用过，那么就需要通过 reselect 方法重新进行选择。而如果在 Invoker 列表中已经没有可用的 Invoker 对象了，那么也就只能直接使用当前选中的这个 Invoker 对象。下图进一步展示了 Invoker 对象的可用性判断逻辑：

![](res/2024-11-06-11-18-55.png)

至于 reselect 方法，它的主要实现过程同样也是借助于 LoadBalance 的 select 方法完成对 Invoker 的重新选择。Dubbo 会使用一个标志位对传递给 LoadBalance 的 Invoker 对象的可用性进行过滤，然后将过滤之后且未被选择的 Invoker 对象列表交给 LoadBalance 执行负载均衡。

以上几个方法中，只有 select 方法的修饰符是 protected 的，可以被 AbstractClusterInvoker 的各个子类根据需要进行直接调用。显然，因为 AbstractClusterInvoker 提供了模板方法，因此它的子类势必是在 doInvoke 方法中调用这些 select 方法。

我们来看一下 FailoverClusterInvoker 的 doInvoke 方法，这个方法的执行逻辑同样不是很复杂。Failover 的意思很简单，就是失败重试，所以可以想象 doInvoke 方法中应该包括一个重试的循环操作。通过翻阅代码，我们确实发现了这样一个 for 循环，裁剪后的代码结构如下所示：

```java
for (int i = 0; i < len; i++) {
      // 由于 Invoker 对象列表可能已经发生变化，所以在执行重试操作前需要进行重新选择
      if (i > 0) {
            // 验证当前 Invoker 对象是否可用
            checkWhetherDestroyed();
            // 重新获取所有服务提供者
            copyinvokers = list(invocation);
            // 重新检查这些 Invoker 对象
            checkInvokers(copyinvokers, invocation);
       }

       // 通过父类的 select 方法获取 invoker
       Invoker<T> invoker = select(loadbalance, invocation, copyinvokers, invoked);
       // …
       try {
            // 发起远程调用
            Result result = invoker.invoke(invocation);
            return result;
       } catch (RpcException e) {
             // 如果是业务异常，直接抛出
 }
 // …
}

// 如果 for 循环执行完毕还是没有找到一个合适的 invoker，则直接抛出异常
throw new RpcException();
```

上述代码中的循环次数来自于 URL 传入的重试次数，默认重试次数是 2。在重试之前，由于 Invoker 对象列表可能已经发生变化，所以需要对当前 Invoker 对象是否可用进行验证，并根据需要进行重新选择。注意到在每一次循环中，我们首先调用父类 AbstractClusterInvoker 中的 select 方法，并将该方法返回的 Invoker 对象保存到一个 invoked 集合中，表示该 Invoker 对象已经被选择和使用。

一旦确定了目标 Invoker 对象，我们就可以通过该对象所提供的 invoke 方法执行远程调用。调用过程可能成功、也可能失败，而失败的结果也分两种情况，如果是业务失败则直接抛出异常，反之我们就继续执行循环。如果整个循环都结束了还是没有成功地完成调用过程，那么最终也会抛出异常。

至此，基于 FailoverClusterInvoker 的集群容错机制讲解完毕。Dubbo 中的其他集群容错实现方案交由你自行进行理解和分析。

## 解题要点

服务容错在当下的分布式系统开发过程中已经属于是一种标准组件，所以在面试过程中也经常出现。关于服务容错的概念和实现策略，需要面试者具备针对性的知识体系。

从解决思路上讲，回答这类问题可以分成两个阶段。

第一个阶段是先解释什么是服务容错。我们需要明确由于存在服务自身失败以及网络瞬态等因素，为了确保服务访问过程的可靠性，服务容错是必不可少的。然后重点是要提到服务的雪崩效应，即在分布式环境下，由于服务依赖失败导致整个服务访问链路不可用。那么雪崩效应究竟是怎么形成的呢？就是因为服务没有做到容错而导致的。

第二阶段，我们需要进一步掌握服务容错实现层面的知识点。对于开发人员而言，相对于原理部分的内容，具体的实现过程反而更加容易把握，多少都能回答一些。但这道题想要回答得有体系化有一定难度，能够体现出不同面试者之间的水平差异。针对集群容错的实现，包括 Failover（失效转移）、Failback（失败通知）、Failsafe（失败安全）和 Failfast（快速失败）等多种实现策略。这些策略本身都并不是很复杂，也没有太多的难点，唯一需要注意的地方在于知识点比较细而多。回答过程中需要按照一定的逻辑进行展开，避免概念之间产生混淆。

## 小结与预告

本讲内容对集群容错的设计思想和实现策略进行了详细的展开。集群容错的实现策略有很多，我们基于 Dubbo 给出了该框架中内置的几种实现方案的底层原理。

请注意，集群容错只是服务容错的其中一种实现方式。主流的实现方式还包括服务熔断。服务熔断的实现需要引入熔断器的概念。那么，什么是熔断器？它又是如何实现服务容错的呢？在下一讲中，我们将基于 Spring Cloud 框架讨论熔断器的实现过程。

# 服务容错：熔断器的基本结构是怎么样的？如何实现？

在上一讲中，我们详细介绍了集群容错的概念以及实施策略。通过构建集群机制来实现服务容错是分布式服务构建过程中的一种常见技术手段，但并不是唯一的技术手段。围绕服务容错，还存在一个面试过程中经常会出现的话题，这就是本讲内容要介绍的服务熔断。

服务熔断的具体表现形式是熔断器。那么，熔断器的基本结构是怎么样的？它又是如何实现的呢？本讲内容将围绕这一问题展开讨论。

## 问题背景

除了上一讲介绍的集群容错，熔断（Circuit Breaker）也是很实用的一种容错机制。在日常开发过程中，如果你使用的是像 Spring Cloud 这样的主流分布式服务框架，那么系统所产生的每一次远程调用的背后都内置了熔断机制，只是你自己可能并没有注意到，或者甚至都没有认识到有这样一个概念。

正是因为服务熔断的实现是一个自动化的过程，而使用方式上也不需要开发人员有太多参与，所以熔断机制往往是一个面试过程中经常被考查的问题。一方面在于熔断机制非常重要，另一方面也可以通过这个问题很好地区分候选人的知识广度和深度。 我作为面试官，经常会对候选人提出这个问题，而得到的回答往往不尽如人意。

从面试角度讲，关于熔断机制有很多种具体的问法，面试官往往会采用这样的方式来考查候选人：

- 熔断器的状态有哪些？相互之间是如何转换的？
- 在系统运行时，如何有效地收集和统计运行时数据？
- 你使用过的熔断器有哪些？它的基本原理是怎么样的？
- 如果让你来设计并实现一个简单的熔断机制，你会怎么做？

上述问题虽然各有侧重点，但对于熔断机制而言，考查的重点还是候选人在工程实践的基础上所掌握的技术原理。

## 问题分析

熔断这个概念实际上并不难理解，类似于日常生活中经常会碰到的电路自动切断机制。我们知道在电路系统中，当电流过大时保险丝就会被融化从而隔断了整个电路回路。类比分布式服务，当系统产生大量异常时，我们也应该隔断整个服务调用链路，避免服务的不断重试触发雪崩效应。

那么服务熔断是如何做到的呢？我们需要明确，对于服务消费者发起的每一次远程调用请求，熔断器都需要进行监控和记录。如果调用的响应时间过长，服务熔断器就应该中断本次调用并直接返回。请注意服务熔断器判断本次调用是否应该快速失败是有状态的，也就是说它会对一段时间的调用结果进行统计，如果统计的结果触发了事先设置好的阈值（类似电路系统中保险丝的过载等级），那么服务熔断机制就会被触发，反之将继续执行后续的远程调用。

通过上述分析，我们可以梳理出如下技术上的要点。

- 状态性：通过合理的状态切换来控制是否对请求进行熔断。
- 运行时数据：收集服务运行时数据并进行统计分析，为阈值判断提供依据。
- 阈值控制：各个状态切换的控制开关。

通过对上述要点的分析，这道题的回答思路就有了，而回答好这道题的关键就是要对上述要点背后的技术原理进行系统的阐述。接下来，让我们来对具体的技术体系展开讨论。

## 技术体系

基于熔断器的设计理念，我们对熔断过程进行进行抽象和提炼，可以得到如下图所示的熔断器基本结构。

![](res/2024-11-08-10-28-55.png)

可以看到，上图所展示的结构简明扼要地给出了熔断器内部所具备的状态机，该状态机包含三个状态，即 Closed（关闭）、Open（打开）和 Half-Open（半开）。

- Closed: 这是熔断器的默认状态。在该状态下，相当于熔断器没有发挥任何效果，所有的请求可以得到正常的响应。但是，在熔断器内部还是会对所有的调用过程进行监控，如果有异常发生则会进行不断累加。
- Open: 这是熔断器的打开状态。在该状态下，相当于熔断器对所有的请求进行了隔断，来自服务消费者的请求不会触达到服务的提供者。同时，在熔断器内部也会启动一个计时器，当处于该状态达到一定时间时，熔断器会进入到半开状态。
- Half-Open: 这是熔断器的半开状态。所谓半开，指的是熔断器会允许一部分请求通过，然后再对这些请求的响应结果进行统计。如果这些请求的成功比例达到一定的阈值，则会把熔断器设回到关闭状态，反之则进入打开状态。

关于熔断器的组成和状态我们已经明确了，但显然还有很多细节是缺失的。如果你只是用这些内容来回答面试问题，应该可以拿到 60 分，但剩下的 40 分才是更好地拉开你和其他候选人之间差距的关键。为了让你更好地理解熔断器的实现原理，接下来，我们讨论如何自己实现一个包含这三个状态的熔断器。

首先，我们需要定义一个枚举类 State，代码如下：

```java
public enum State {
   CLOSED,
   OPEN,
   HALF_OPEN
}
```

然后，我们定义代表熔断器的 CircuitBreaker 接口，如下所示：

```java
public interface CircuitBreaker {
   // 成功的响应，会对熔断器状态进行重置
   void recordSuccess();
   // 失败的响应，根据需要对状态进行设置
   void recordFailure(String response);
   // 获取熔断器的当前状态
   String getState();
   // 设置熔断器状态
   void setState(State state);
   // 对远程服务发起请求
   String attemptRequest() throws RemoteServiceException;
}
```

对于 CircuitBreaker 接口的实现过程是我们讨论的重点。为了实现对熔断器状态的合理控制，我们首先需要定义一系列的中间变量，如下所示：

```java
// 远程调用的超时时间
private final long timeout;
// 重试时间间隔
private final long retryTimePeriod;
// 最近一次的调用失败时间
long lastFailureTime;
// 最近一次的失败响应结果
private String lastFailureResponse;
// 累计失败次数
int failureCount;
// 失败率阈值
private final int failureThreshold;
// 熔断器状态
private State state;
// 类似无限大的一个未来时间
private final long futureTime = 1000000000000;
```

当我们发起一个远程调用时，我们需要基于调用结果合理设置熔断器的状态，代码如下所示：

```java
public String attemptRequest() throws RemoteServiceException {
    evaluateState();
    if (state == State.OPEN) {
      // 如果熔断式处于打开状态，就直接返回失败结果
      return this.lastFailureResponse;
    } else {
       try {
        // 执行远程调用
        var response = service.call();
        // 远程调用成功
        recordSuccess();
        return response;
      } catch (RemoteServiceException ex) {
        // 远程调用失败
        recordFailure(ex.getMessage());
        throw ex;
      }
    }
}
```

我们继续来实现当调用成功和失败时，对应的 recordSuccess 和 recordFailure 方法的执行逻辑，代码如下所示：

```java
// 调用成功，失败次数清零，最近失败时间设置成无限大，并把熔断器状态设置成关闭
public void recordSuccess() {
    this.failureCount = 0;
    this.lastFailureTime = System.nanoTime() + futureTime;
    this.state = State.CLOSED;
}

// 调用失败，失败次数加 1，最近失败时间设置成当前时间，并把失败结果设置成最近一次调用失败的响应
public void recordFailure(String response) {
    failureCount = failureCount + 1;
    this.lastFailureTime = System.nanoTime();
    this.lastFailureResponse = response;
}
```

当系统运行一段时间之后，我们如何来获取熔断器的当前状态呢？可以实现如下所示的 getState 方法：

```java
public String getState() {
    // 如果失败次数大于阈值
    if (failureCount >= failureThreshold) {
      if ((System.nanoTime() - lastFailureTime) > retryTimePeriod) {
        // 如果失败的累计时间已经超过了所允许的重试时间间隔，状态即为半熔断（相当于此时已经过了重试时间，需要打开半开状态）
        state = State.HALF_OPEN;
      } else {
        // 反之，熔断器应该为开启状态
        state = State.OPEN;
      }
    } else {
      // 熔断器为打开状态
      state = State.CLOSED;
    }
    return state.name();
}
```

对应的，如果我们想要直接对熔断器状态进行设置，可以使用如下所示的 setState 方法：

```java
public void setState(State state) {
    this.state = state;
    switch (state) {
      case OPEN: // 设置开启状态
        this.failureCount = failureThreshold;
        this.lastFailureTime = System.nanoTime();
        break;
      case HALF_OPEN: // 设置半开状态
        this.failureCount = failureThreshold;
        this.lastFailureTime = System.nanoTime() - retryTimePeriod;
        break;
      default: // 默认为关闭状态
        this.failureCount = 0;
    }
}
```

可以看到，这里我们也只是通过对熔断器的几个核心变量设置合适的值来更新熔断器的最新状态。

以上代码示例可以帮助你更好地理解一个熔断器的内部实现原理，也可以帮助你回答类似“如果让你来实现一个简单的熔断机制，你会怎么做？”这种开放式问题。但是，这个毕竟只是一个示例。要想完整理解熔断器的实现过程，还是需要我们来对主流分布式服务框架中的原理展开解析。

## 源码解析

在 Spring Cloud 中，专门为开发人员提供了具备服务熔断功能的 Spring Cloud Circuit Breaker 组件。从命名上看，Spring Cloud Circuit Breaker 是对熔断器的一种抽象，支持不同的熔断器实现方案。在 Spring Cloud Circuit Breaker 中，内置了四种熔断器，如下图所示：

![](res/2024-11-08-11-09-46.png)

上图中的 Netflix Hystrix 显然来自于 Netflix OSS，Resilience4j 是受 Hystrix 项目启发所诞生的一款新型的容错库，Sentinel 从定位上讲是一款包含了熔断降级功能的高可用流量防护组件，而最后的 Spring Retry 是 Spring 自研的重试和熔断框架。针对以上四种熔断器，Spring Cloud Circuit Breaker 提供了统一的 API。

### Spring Cloud Circuit Breaker 组成结构

为了在应用程序中创建一个熔断器，我们可以使用 Spring Cloud Circuit Breaker 中的工厂类 CircuitBreakerFactory，该工厂类的定义如下：

```java
public abstract class CircuitBreakerFactory<CONF, CONFB extends ConfigBuilder<CONF>> extends AbstractCircuitBreakerFactory<CONF, CONFB> {
   public abstract CircuitBreaker create(String id);
}
```

可以看到这是一个抽象类，只有一个 create 方法用来创建 CircuitBreaker。CircuitBreaker 是一个接口，约定了熔断器应该具有的功能，该接口定义如下所示：

```java
public interface CircuitBreaker {
   default <T> T run(Supplier<T> toRun) {
      return run(toRun, throwable -> {
         throw new NoFallbackAvailableException("No fallback available.", throwable);
      });
   };

   <T> T run(Supplier<T> toRun, Function<Throwable, T> fallback);
}
```

这里用到了函数式编程的一些语法，但我们从方法定义上还是可以明显看出包含了 run 和 fallback 这两个方法。其中的 Supplier 包含了你希望运行在熔断器中的业务代码，而 Function 则代表着回退（Fallback）方法。如果你熟悉 Netflix Hystrix 中的 HystrixCommand，你会发现两者之间存在明显的对应关系。

在 Spring Cloud Circuit Breaker 中，分别针对 Hystrix、Resilience4j、Sentinel 和 Spring Retry 这四款框架提供了 CircuitBreakerFactory 抽象类的子类。一旦在代码工程的类路径中添加了相关的 starter，系统就会自动创建 CircuitBreaker。也就是说 CircuitBreakerFactory.create 方法会实例化对应框架的一个 CircuitBreaker 实例。

在引入具体的开发框架之后，下一步工作就是对它们进行配置。在 CircuitBreakerFactory 的父类 AbstractCircuitBreakerFactory 中，我们发现了如下所示的两个抽象方法：

```java
// 针对某一个 id 创建配置构造器
protected abstract CONFB configBuilder(String id);

// 为熔断器配置默认属性
public abstract void configureDefault(Function<String, CONF> defaultConfiguration);
```

这里用到了大量的泛型定义，我们可以猜想，在这两个抽象方法的背后，Spring Cloud Circuit Breaker 会针对不同的第三方框架提供不同的配置实现过程。我们在接下来的内容中会基于具体的框架对这一过程做展开讨论。

让我们来到 Hystrix 框架，来看看在 Spring Cloud Circuit Breaker 中是如何使用统一编程模式完成对该框架的集成。我们首先关注实现了 CircuitBreaker 接口的 HystrixCircuitBreaker 类，如下所示：

```java
public class HystrixCircuitBreaker implements CircuitBreaker {
   private HystrixCommand.Setter setter;

   public HystrixCircuitBreaker(HystrixCommand.Setter setter) {
      this.setter = setter;
   }

   @Override
   public <T> T run(Supplier<T> toRun, Function<Throwable, T> fallback) {
      HystrixCommand<T> command = new HystrixCommand<T>(setter) {
         @Override
         protected T run() throws Exception {
            return toRun.get();
         }

         @Override
         protected T getFallback() {
            return fallback.apply(getExecutionException());
         }
      };

      return command.execute();
   }
}
```

不难想象，这里应该构建了一个 HystrixCommand 对象，并在该对象原有的 run 和 getFallback 方法中封装了 CircuitBreaker 中的统一方法调用，而最终实现熔断操作的还是 Hystrix 原生的 HystrixCommand。

然后，我们接着来看 HystrixCircuitBreakerFactory，这个类的实现过程也简洁明了，如下所示：

```java
public class HystrixCircuitBreakerFactory extends CircuitBreakerFactory<HystrixCommand.Setter, HystrixCircuitBreakerFactory.HystrixConfigBuilder> {
   // 实现默认配置
   private Function<String, HystrixCommand.Setter> defaultConfiguration = id -> HystrixCommand.Setter.withGroupKey(
      HystrixCommandGroupKey.Factory.asKey(getClass().getSimpleName())).andCommandKey(HystrixCommandKey.Factory.asKey(id));

   public void configureDefault(Function<String, HystrixCommand.Setter> defaultConfiguration) {
      this.defaultConfiguration = defaultConfiguration;
   }

   public HystrixConfigBuilder configBuilder(String id) {
      return new HystrixConfigBuilder(id);
   }

   // 创建熔断器
   public HystrixCircuitBreaker create(String id) {
      Assert.hasText(id, "A CircuitBreaker must have an id.");
      HystrixCommand.Setter setter = getConfigurations().computeIfAbsent(id, defaultConfiguration);
      return new HystrixCircuitBreaker(setter);
   }

   // 创建配置构造器
   public static class HystrixConfigBuilder extends AbstractHystrixConfigBuilder<HystrixCommand.Setter> {
      public HystrixConfigBuilder(String id) {
         super(id);
      }

      @Override
      public HystrixCommand.Setter build() {
         return HystrixCommand.Setter.withGroupKey(getGroupKey()).andCommandKey(getCommandKey()).andCommandPropertiesDefaults(getCommandPropertiesSetter());
      }
   }
}
```

上述代码基本就是对原有 HystrixCommand 中关于服务分组等属性的简单封装，你可以结合接下来要介绍的 Hystrix 框架熔断机制内容做进一步理解。

### Hystrix 熔断机制

在 Hystrix 中，最核心的就是 HystrixCircuitBreaker 接口，该接口代表了对熔断器的抽象过程，如下所示：

```java
public interface HystrixCircuitBreaker {
   public boolean allowRequest();
   public boolean isOpen();
   void markSuccess();
}
```

可以看到 HystrixCircuitBreaker 接口只有三个方法。在 Hystrix 中，该接口的实现类是 HystrixCircuitBreakerImpl。

我们首先来看最重要的 allowRequest 方法，该方法用来判断每个请求是否可被执行。allowRequest 实际上是对 isOpen 方法做了一层封装，在通过调用 isOpen 来触发熔断器的计算逻辑之前，先根据 HystrixCommandProperties 中的配置信息来判断是否强制开启熔断器，具体实现如下所示：

```java
public boolean allowRequest() {
   if (properties.circuitBreakerForceOpen().get()) {
      return false;
   }

   if (properties.circuitBreakerForceClosed().get()) {
      isOpen();
      return true;
   }

   return !isOpen() || allowSingleTest();
}
```

接下来的 isOpen 方法用来获取熔断器的当前状态。请注意，熔断器中关于阈值判断的一系列处理逻辑都位于该方法中，如下所示：

```java
public boolean isOpen() {
   if (circuitOpen.get()) {
      return true;
   }

   HealthCounts health = metrics.getHealthCounts();
   // 检查是否达到最小请求数，如果未达到的话即使请求全部失败也不会熔断
   if (health.getTotalRequests() < properties.circuitBreakerRequestVolumeThreshold().get()) {
      return false;
   }

   // 检查错误百分比是否达到设定的阀值，如果未达到的话也不会熔断
   if (health.getErrorPercentage() < properties.circuitBreakerErrorThresholdPercentage().get()) {
      return false;
   } else {
      // 如果错误率过高, 进行熔断，并记录下熔断时间
      if (circuitOpen.compareAndSet(false, true)) {
         circuitOpenedOrLastTestedTime.set(System.currentTimeMillis());
         return true;
      } else {
         return true;
      }
   }
}
```

最后，我们来到用来关闭熔断器的 markSuccess 方法。显然，该方法在熔断器处于半开状态下进行使用，我们可以通过该方法将熔断器设置为关闭状态。这时候，熔断器要做的一件事情就是重置对请求的统计指标，如下所示：

```java
public void markSuccess() {
   if (circuitOpen.get()) {
      if (circuitOpen.compareAndSet(true, false)) {
         metrics.resetStream();
      }
   }
}
```

HystrixCircuitBreaker 接口的这三个方法的执行逻辑实际上都不复杂，HystrixCircuitBreaker 通过一个 circuitOpen 状态位控制着整个熔断判断流程，而这个状态位本身的状态值则取决于系统目前的运行时数据。

## 解题要点

在分布式系统开发过程中，服务熔断的实现需要引入熔断器的概念，事实上像 Spring Cloud 等很多开源框架都内置了熔断器的实现组件。我在面试中发现很多开发人员已经在使用这些组件了，但并不清楚其背后的设计思想和原理。所以，这道题也是比较典型的从应用到原理的反向考查类的面试题。

从解题思路上讲，目前业界主流的熔断器实现模型基本都是类似的。就知识体系而言，要注意的是在熔断器内部实现过程中，并不是只有熔断和非熔断这两个简单状态，而是会引入一个半熔断的状态，通过对当前服务所处理请求的情况进行统计分析，熔断器会基于一定的阈值动态完成这些状态之间的自动切换。

另一方面，面试官在考查候选人能力的一大关注点还是实践能力，所以可以结合具体工具的使用过程来阐述熔断器的核心概念。在日常开发过程中，熔断器的使用方式主要是依赖于一系列的配置项。例如基于 Resilience4j 来使用 Spring Cloud Circuit Breaker 时，典型的配置项如下所示：

```yaml
resilience4j:
   circuitbreaker:
      configs:
         default:
            ringBufferSizeInClosedState: 10 # 熔断器关闭时的缓冲区大小
            ringBufferSizeInHalfOpenState: 4 # 熔断器半开时的缓冲区大小
            waitDurationInOpenState: 20000 # 熔断器从打开到半开需要的时间
            failureRateThreshold: 80 # 熔断器打开的失败阈值
            recordExceptions: # 记录的异常
               - com.example.resilience4j.exceptions.BusinessBException
               - com.example.resilience4j.exceptions.BusinessAException
            ignoreExceptions: # 忽略的异常
               - com.example.resilience4j.exceptions.BusinessAException
      instances:
         aServiceCircuitBreaker:
            baseConfig: default
         bServiceCircuitBreaker:
            baseConfig: default
            waitDurationInOpenState: 5000
            failureRateThreshold: 20
```

这些配置信息可以分为两部分，一部分是默认配置，一部分是专属于某一个服务的特定配置。这里也展示了用来打开熔断器的失败阈值 failureRateThreshold、熔断器从打开到半开需要的时间 waitDurationInOpenState 等配置参数，以及针对异常类型的精细化控制过程。

最后，在回答这道题时，一种比较好的解题思路是结合某个熔断器开源框架来分析它的内部实现原理，这是一个很大的加分项。

## 小结与预告

服务熔断在分布式服务构建过程中是一种标配组件，例如在 Spring Cloud 中专门提供了一个 SpringCloudApplication 注解（如下所示），而在该注解中就把用来启用熔断器的 @EnableCircuitBreaker 和用来启用服务发现机制的 @EnableDiscoveryClient 以及 Spring Boot 的基础注解 @SpringBootApplication 放在一起，确保所有分布式服务都内置了服务熔断机制。

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableCircuitBreaker
public @interface SpringCloudApplication
```

服务熔断的概念和原理理解起来都有一定的复杂度。在本讲内容中，我们从熔断器的基本结构开始讲起，详细分析了它在 Spring Cloud 的实现过程。同时，我们还自己实现了一个简单而又完整的熔断器示例，帮助你对服务熔断的实现过程有更为感性的认识。就算你平时没有专门针对熔断器做过系统学习，相信通过本讲内容的介绍也能帮助你顺利应对技术面试。

掌握了服务熔断机制之后，下一讲我们将讨论另一个确保服务高可用的技术组件，即服务降级。和服务熔断一样，我们也可以采用不同的技术手段来对服务进行降级。那么，服务降级的常见实现策略有哪些呢？我们下一讲再聊。

// TODO https://juejin.cn/book/7106442254533066787/section/7107604658914328588
