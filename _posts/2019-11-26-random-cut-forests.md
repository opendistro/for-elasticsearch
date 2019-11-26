---
layout: posts
author: Sudipto Guha and Joshua Tokle
comments: true
title: "Random Cut Forests"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We plan to publish a series of blogs discussing the science and math behind Random Cut Forests (RCF). In this first post we begin with a brief overview of Random Forests as a class of Machine Learning model. Next, we introduce RCFs and highlight their relevance to streaming data. Finally, we close with a look to the future, giving ideas for how RCFs support an Online Learning approach to a variety of statistical problems.


## Random Forests in Machine Learning


Random Forests (RF) [3, 4] are a well-known ML technique consisting of an ensemble of tree-based models, where each tree is typically trained on a random subset of data and features.  Individual trees are built up recursively using a partitioning rule, where each non-leaf node in the tree corresponds to a rule that splits or partitions the training data into disjoint subsets. When a tree is used to score a new point, we traverse a path from the tree root to a leaf node by applying those same rules to that point. In the leaf node we assign a score value to the point based on the assumption that, because of our partitioning rule, the new point is similar to the training points that were assigned to that leaf node. Thus, the key ingredients of the RF model are the use of random subsets of training data, which makes the model robust with little tuning by the user, and the choice of the splitting or partitioning rule, which determines how new data points are matched to similar points in the training data. In a traditional RF the partitioning rule is defined by the Classification and Regression Tree (CART) model, but many other partitioning rules have been studied [13]. One thing that standard RF methods have in common is that the partition rule is optimal in some way. For example, a CART model defines its rule as identifying the feature in the data that best separates records into distinct classes of interest. Because the partitioning rule is optimal (and, hence, powerful), the subsequent scoring or inference rule tends to be simple.


There is a drawback, however, to the approach of combining a powerful partition rule with a simple inference rule: trees in an RF model cannot be updated dynamically and have to be rebuilt in order to accommodate changes to the training data set. This comes to the fore in the context of continually evolving data streams. While micro-batch or mini-batch forest rebuilding strategies are reasonable for large static data sets, continually evolving streams have a premium on recency that necessitates continuous learning. Continuous learning in this scenario decomposes into an update phase, in which the model data structures are updated with new data, and an inference phase.


## Random Cut Forests


Random Cut Forests (RCF) are organized around this central tenet: updates are better served with simpler choices of partition. More advanced algorithms in the inference phase can compensate for simpler updates. There are two immediate benefits of following this tenet. First, it provides a general purpose framework that enables continuous learning over data streams. RCFs serve as sketches or synopses of evolving data streams and multiple different scoring functions or even different types of forests are supported with the same set of trees. Second, it frames streaming estimation algorithms as a small operation on a summarized multi-level local context. This enables one to review foundational premises in different statistical estimation algorithms and perhaps even invent new ones.


Random Cut Forests (RCF) are organized around this central tenet: updates are better served with simpler choices of partition. More advanced algorithms in the inference phase can compensate for simpler updates. There are two immediate benefits of following this tenet. First, it provides a general purpose framework that enables continuous learning over data streams. RCFs serve as sketches or synopses of evolving data streams and multiple different scoring functions or even different types of forests are supported with the same set of trees. Second, it frames streaming estimation algorithms as a small operation on a summarized multi-level local context. This enables one to review foundational premises in different statistical estimation algorithms and perhaps even invent new ones.


## RCFs as Sketches


RCFs were first developed in the context of anomaly detection [11], improving upon the Isolation Forest (IF) algorithm [15], which is an example of an RF algorithm as described above. Typical to other members of the class, IF does not allow incremental inference respecting the arrow of time without expensive rebuilding. However, anomaly detection is often not the end point but rather a the starting point of an eventual root cause analysis. A single bit prediction indicating whether a given point is an anomaly may not, by itself, be actionable. In many scenarios, anomalies are a starting point of investigation and one would like to answer auxiliary questions. The questions can be seeking further information or counterfactual. As examples of the former, one is often interested in answering “which dimensions had substantial impact” or “did the density of points drop/rise in nearby regions”? As examples of latter, one could ask “what should have been the observed value at this time” or “why was this point not marked an anomaly”? At an intuitive level, a data structure such an RCF that has some capacity to discern “anomalous” in an unknown distribution should also be able to inform us about normal characteristics. Further, in making that information explicit the structure provides us answers to the kinds of auxiliary questions posed here. But that step of making the information explicit requires rethinking the inference phase. It is instructive that the framework primarily developed for anomaly detection can provide applications in forecasting, (anisotropic) density estimation, and distance estimation, which are all examples of applications that have been used to define classes of anomaly detection algorithms. (See references in the extended surveys [1, 6].) Densities, distances, and predictions provide different vignettes of a stochastic process. A primary goal of sketches or synopses is to enable a multitude of such vignettes.


The RCF implementation provides a few generic traversal methods such that a user only has to define computations at “internal nodes” and “leaf nodes” to design and evaluate their own scoring functions. Provable maintenance under insertion and deletions allows one to conceptually separate the context of sampling and inference. Users can swap scoring functions programmatically on the fly, run an ensemble of functions, or have a console experience of deep dive with new trial functions. This potentially allows for the development of domain specific or regime specific scoring – optimizing over a space of functions not unlike hyperparameter optimization. An interesting consequence of the setup (and randomization) is that one could also simulate different classes of forests in a dynamic manner. For example, how would an RCF built using probabilistic choices similar to IF score this given point? This simulation is Monte Carlo and has errors, but allows greater options for a user without incurring resource costs for maintaining or foreseeing every possible eventuality. Quite literally, one can bring one’s own hyper-forest to the analysis.


## Rethinking Random Forests


From a foundational perspective, the ability to defer difficult computation to the simulation or inference phase while keeping updates simple opens up a plethora of tantalizing possibilities. Partition strategies in random forests (over possibly categorical variables) are typically complicated because they attempt to keep subtrees “pure” (informed by explicit or implicit classification) — dating back to stochastic discrimination introduced in [14]. It does not escape our attention that for two well separated Gaussians, a random cut would always produce one subtree to be “almost pure” and the other subtree can be mixed. This property or random cuts is agnostic of the complexity of the definition of separation, and remains true as long as the separation is observable. The fact that a random cut would make one subtree “almost pure” is a plausible explanation of the recorded success of IF. (In addition to distance-based explanations in [11].) Simulation at inference time allows us to address a foundational issue which can be missing in naive applications of ensemble forests. The basic question is: is the evaluation criterion cognizant of the point being evaluated? Affirmative answer corresponds to transduction, where we are trying to decide “this point, which we are staring at, is an anomaly?”. Negative answer corresponds to modeling the entire observable space and all eventualities, which corresponds to induction. Transduction is regarded to be easier than induction and for anomaly detection, perhaps transduction is a better fit since anomalies are often hard to define but easy to verify a la Justice Stewart Potter. However inductive explanations (mismatch from a prediction) are often easier to follow. The balance of these two aspects is key – much of inference lie in the ability of discerning between transduction and induction. For example in semi-supervised learning [17], similar assumptions about the point under consideration affect a global inference.


On a more prosaic level, there exists a large literature that considers generalization error in RF which cannot be summarized herein. The solution in said literature seems to necessitate more state, which is typical of induction, where all eventualities are pre-considered. These ideas often uses a combination of (i) more trees (ii) diversified adaptive sampling (iii) linearity (iv) symmetry (isotropy) (v) convexity, and similar assumptions which are difficult to even verify for a continually evolving data stream. However each of these ideas can have serious side effects, for example, adaptive sampling (unless formally proved) can break the arrow of time and not be interpretable for one-pass streaming. The ability to simulate different aspects of RF without having to worry about addressing unverifiable assumptions or distorting the arrow of time will likely lead to next generation of ideas for RF, in particular in relation to addressing time as a variable. The feature where an user simply specifies small evaluations with limited state and context, at internal nodes or leaves, can be useful in this regard because it nudges an user to view estimation in terms of recursive strategies (which are dynamic in nature) as opposed to designing static functions and retrofitting time. The analysis ideas appear to tie these forests to Information Geometry [2] and sketches of information distances [8, 10].


We hope that ideas herein foster new innovation from the community in all the aspects discussed above – from computational considerations to better mathematical modeling and to better theoretical understanding of stochastic processes. We close with the remark that anomaly detection is typically the starting point of inquiry.


## References


[1] C. C. Aggarwal. Outlier Analysis. Springer New York, 2013.


[2] S. Amari and H. Nagaoka. Methods of Information Geometry. Translations of Mathematical Monographs, American Mathematical Society. 2000.


[3] Y. Amit and D. Geman. Shape quantization and recognition with randomized trees. Neural Computation, 9(7):1545–1588, 1997.


[4] L. Breiman. Random forests. Machine Learning, 45(1):532, 2001.


[5] L. Breiman, J. H. Friedman, R. A. Olshen, and C. J. Stone. Classification and regression trees. Chapman and Hall/CRC, 1984.


[6] V. Chandola, A. Banerjee, and V. Kumar. Anomaly detection: A survey. ACM Comput. Surv., 41(3):15:1–15:58, July 2009.


[7] G. Ghare, S. Guha, L. Moos, G. Roy, J. Tokle, and A. Satish. Anisotropic local interpolation for data streams with applications. Manuscript, 2019.


[8] S. Guha, P. Indyk, and A. McGregor. Sketching information divergences. Machine Learning, 72:5–19, 2008.


[9] S. Guha, S. Kalki, and A. Satish. Streaming algorithms for continuous forecasting. Manuscript, 2018.


[10] S. Guha, A. McGregor, and S. Venkatasubramanian. Sublinear estimation of entropy and information distances. ACM Trans. Algorithms, 5(4)(35):1–35, 2009.


[11] S. Guha, N. Mishra, G. Roy, and O. Schrijver. Robust random cut based anomaly detection in dynamic data streams. Proc. of ICML (JMLR Proceedings Series), 2016.


[12] T. Hastie, R. Tibshirani, and J. Friedman. The Elements of Statistical Learning. Springer New York Inc., New York, NY, USA, 2001.


[13] H. Ishwaran. The effect of splitting on random forest. Machine learning, 99:75–118, 2014.


[14] E. M. Kleinberg. Stochastic discrimination. Annals of Mathematics and Artificial Intelligence, 1990.


[15] F. T. Liu, K. M. Ting, and Z.-H. Zhou. Isolation-based anomaly detection. ACM Trans. Knowl. Discov. Data, 6(1):13:39, 2012.


[16] M. L. Stein. Interpolation of Spatial Data: Some Theory for Kriging. Springer, 1998.


[17] X. Zhu, J. Lafferty, and Z. Ghahramani. Combining active learning and semi-supervised learn- ing using gaussian fields and harmonic functions. In ICML 2003 workshop on The Continuum from Labeled to Unlabeled Data in Machine Learning and Data Mining, pages 58–65, 2003.

## About the Authors


Sudipto Guha is principal scientist at Amazon Web Services, where he studies the design and implementation of a wide range of computational systems, from resource-constrained devices, such as sensors, to massively parallel and distributed systems. Sudipto is the prime contributor to the Random Cut Forest library.


Joshua Tokle is a senior software engineer at Amazon and has worked on AWS Glue and Kinesis Analytics. Prior to joining Amazon Joshua worked as a data scientist and statistician with a specialization in record linkage algorithms. His current interests include statistical and machine learning algorithms on streams. Joshua is a contributor to the Random Cut Forest library.
